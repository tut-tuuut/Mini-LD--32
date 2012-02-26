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
    name: 'truelaby',
    type: 'image',
    src: 'truelaby.png'
},{
    name: 'collision',
    type: 'image',
    src: 'collision.png'
}, {
    name: 'maze',
    type: 'tmx',
    src:  'maze.tmx'
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
    name: 'bg',
    type: 'image',
    src: 'bg.png'
},{
    name: 'nuages',
    type: 'image',
    src: 'nuages.png'
}];


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
        this.defaultVelocity = 3;
        
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },

    /* -----

    update the blob pos

    ------ */
    update: function() {


        // check & update player movement
        this.updateMovement();
        

        // check for collision
        var res = me.game.collide(this);

        if (me.input.isKeyPressed('left')) {
            this.doWalk(true);
        } else if (me.input.isKeyPressed('right')) {
            this.doWalk(false);
        } else if (me.input.isKeyPressed('top')) {
            this.doClimb(true);
        } else if (me.input.isKeyPressed('bottom')) {
            this.doClimb(false);
        } else {
            this.vel.x = 0;
            this.vel.y = 0;
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

var HeartEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);
    },

    // this function is called by the engine, when
    // an object is destroyed (here collected)
    // at least here it's not too complicated.
    onDestroyEvent: function() {
        me.state.change(me.state.GAME_END);
    }

});

var jsApp	= 
{	
    /* ---
	
		Initialize the jsApp
		
		---			*/
    onload: function()
    {
        // init the video
        if (!me.video.init('jsapp', 200, 200, false, 1.0))
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
        me.entityPool.add("blob", BlobEntity);
        me.entityPool.add("heart", HeartEntity);
           
        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT,	"left");
        me.input.bindKey(me.input.KEY.RIGHT,	"right");
        me.input.bindKey(me.input.KEY.UP,	"top");
        me.input.bindKey(me.input.KEY.DOWN,	"bottom");
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
        me.levelDirector.loadLevel('maze');
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

