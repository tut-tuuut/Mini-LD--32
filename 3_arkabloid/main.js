/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Step by step game creation tutorial
 *
 **/
//game resources
var g_resources = [{
    name: 'laby',
    type: 'image',
    src: 'laby.png'
},{
    name: 'collision',
    type: 'image',
    src: 'collision.png'
}, {
    name: 'laby',
    type: 'tmx',
    src:  'laby.tmx'
},
{
    name: 'blob',
    type: 'image',
    src: 'blob.png'
},
{
    name: 'heart',
    type: 'image',
    src : 'heart.png'
},
{
    name: 'win',
    type: 'image',
    src : 'win.png'
},
{
    name: 'trampoline',
    type: 'image',
    src: 'trampoline.png'
},
{
    name: 'brick1',
    type: 'image',
    src: 'brick1.png'
},
{
    name: 'brick2',
    type: 'image',
    src: 'brick2.png'
}];

/*------------------- 
a player entity
-------------------------------- */
var TrampolineEntity = me.ObjectEntity.extend({

    /* -----

    constructor

    ------ */

    init: function(x, y, settings) {

        // call the constructor
        this.parent(x, y, settings);

        // set the walking & jumping speed
        this.setVelocity(6, 15);

        // set the display to follow our position on both axis
        this.collidable = true;
        this.type = me.game.ENEMY_OBJECT;
        
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },

    /* -----

    update the player pos

    ------ */
    update: function() {

        if (me.input.isKeyPressed('left')) {
            this.doWalk(true);
        } else if (me.input.isKeyPressed('right')) {
            this.doWalk(false);
        } else {
            this.vel.x = 0;
        }


        // check & update player movement
        this.updateMovement();

        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }
        return false;
    }

});


/*------------------- 
a "ball" entity
-------------------------------- */
var BlobEntity = me.ObjectEntity.extend({

    /* -----

    constructor

    ------ */

    init: function(x, y, settings) {

        // call the constructor
        this.parent(x, y, settings);

        // set the walking & jumping speed
        this.setVelocity(3, 15);
        this.gravity = 0.2;
    },

    /* -----

    update the blob pos

    ------ */
    update: function() {

        // bounce on walls
        if (this.vel.y != 0) {
            if (this.pos.x <= 25) {
                this.vel.x = Math.max(this.vel.x, 10);
            } else if (this.pos.x >= 760) {
                this.vel.x = Math.min(-this.vel.x, -10);
            }
        } else if (this.pos.y <= 615) {
            // f*** don't walk when you're on the ground
            this.vel.x = 0;
        }

        // check & update player movement
        this.updateMovement();
        

        // check for collision
        var res = me.game.collide(this);
        if (res) {
            if (res.obj.type == me.game.ENEMY_OBJECT ) {
                if (this.vel.y != 0) {
                    this.vel.y = - 2*this.accel.y*this.vel.y;
                    console.log(res.obj.pos.x, this.pos.x, res.obj.pos.x - this.pos.x);
                    this.vel.x = -2*(res.obj.pos.x - this.pos.x + 36) - this.vel.x;
                }
            } else if (res.obj.type == me.game.COLLECTABLE_OBJECT) {
                this.vel.y = - this.vel.y;
            }
        }
        if (me.input.isKeyPressed('jump') && this.vel.x == 0 && this.vel.y == 0) {
            this.vel.x = Math.floor(20*Math.random()) - 10;
            if (this.pos.x >= 760) {
                this.vel.x = -10;
            } else if (this.pos.x <= 20) {
                this.vel.y = 10;
            }
            this.doJump();
        }
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }
        return false;
    }

});

/*----------------
 a Brick entity
------------------------ */
var BrickEntity = (function() {
    var totalBricks = 0;
    var collectedBricks = 0;
    return me.CollectableEntity.extend({
        // extending the init function is not mandatory
        // unless you need to add some extra initialization
        init: function(x, y, settings) {
            totalBricks++;
            // call the parent constructor
            this.parent(x, y, settings);
        },

        // this function is called by the engine, when
        // an object is destroyed (here collected)
        onDestroyEvent: function() {
                collectedBricks++;
                if (collectedBricks == totalBricks) {
                    me.state.change(me.state.GAME_END);
                }
            }

    })
    }());

var jsApp	= 
{	
    /* ---
	
		Initialize the jsApp
		
		---			*/
    onload: function()
    {
        // init the video
        if (!me.video.init('jsapp', 800, 640, false, 1.0))
        {
            alert("Sorry but your browser does not support html 5 canvas.");
            return;
        }
				
        // initialize the "audio"
        me.audio.init("mp3,ogg");
		
        // set all resources to be loaded
        me.loader.onload = this.loaded.bind(this);
		
        // set all resources to be loaded
        me.loader.preload(g_resources);

        // load everything & display a loading screen
        me.state.change(me.state.LOADING);
        
    },
	
	
    /* ---
	
		callback when everything is loaded
		
		---										*/


    loaded: function ()
    {
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new PlayScreen());
        me.state.set(me.state.GAME_END, new WinScreen());

        // add our player entity in the entity pool
        me.entityPool.add("trampoline", TrampolineEntity);
        me.entityPool.add("blob", BlobEntity);
        me.entityPool.add("brick", BrickEntity);
           
        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT,	"left");
        me.input.bindKey(me.input.KEY.RIGHT,	"right");
        me.input.bindKey(me.input.KEY.X,     "jump", true);
        me.input.bindKey(me.input.KEY.ESC,   'hold');
        // start the game 
        me.state.change(me.state.PLAY);
    }


}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

    onResetEvent: function()
    {	
        me.levelDirector.loadLevel('laby');
    },
	
	
    /* ---
	
		 action to perform when game is finished (state change)
		
		---	*/
    onDestroyEvent: function()
    {
	
    }

});

var WinScreen = me.ScreenObject.extend({

    // constructor
    init: function() {
        this.parent(true);

        // title screen image
        this.title = null;

        this.font = null;
        this.scrollerfont = null;
        this.scrollertween = null;

        this.scroller = "This is my first MelonJS Game.";
        this.scrollerpos = 30;
    },

    // reset function
    onResetEvent: function() {
        if (this.title == null) {
            // init stuff if not yet done
            this.title = me.loader.getImage("win");

        }
        // enable the keyboard
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);

    },

    // update function
    update: function() {
        // enter pressed ?
        if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }
        return true;
    },

    // draw function
    draw: function(context) {
        context.drawImage(this.title, 0, 0);
    },

    // destroy function
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);

    //just in case
    }

});

//bootstrap :)
window.onReady(function() 
{
    jsApp.onload();
});

