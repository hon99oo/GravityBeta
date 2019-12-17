var map;
var map2;
var map3;
var tileset;
var layer;
var layerUp;
var player;
var isGravity = 0;
var cursors;
var isJump = 0;
var isCollided = 0;
var isReverse=0;
var water;
var backgroundImage;
var diecount = 0;
var diecount2 = 0;
var diecount3 = 0;
var Stageclearsound;
var Gravitys;
var text4;
var text5;
var text6;
var Dies;
var Jumps;
var TeleS;
var keyQ;
var keyW;
var keyE;

var Menu = new Phaser.Class({
  Extends:Phaser.Scene,
  initialize:
  function Menu(){
    Phaser.Scene.call(this,{key:'Menu'});
  },
  preload:function(){
    this.load.image('gravity','gravity.png');
    this.load.audio('Mainsound', [
            'Menusound.mp3'
        ]);
  },
  create:function(){
    var bg = this.add.image(400,300,'gravity');
    bg.setInteractive();
    var menus = this.sound.add('Mainsound');
    menus.play();
    this.time.addEvent({
      delay:289000,
      callback:()=>{
        menus.play();},
      loop:true
    })
    var text1 = this.add.text(125,400,'- C l i c k  T o  S t a r t -',{font:'32px Courier'
    });
    this.cameras.main.once('camerafadeoutcomplete',function(camera){
      camera.fadeIn(3000);
    },this);
    this.cameras.main.fadeOut(3000);

    bg.once('pointerup',function(){
      this.scene.start('HowToPlay');
    },this);
  }
});
var HowToPlay = new Phaser.Class({
  Extends:Phaser.Scene,
  initialize:
  function HowToPlay ()
   {
       Phaser.Scene.call(this, { key: 'HowToPlay' });
   },
   preload:function(){
    this.load.image('up','up.png');
    this.load.image('down','down.png');
    this.load.image('right','right.png');
    this.load.image('left','left.png');
   },
   create:function(){
     this.cameras.main.once('camerafadeoutcomplete',function(camera){
       camera.fadeIn(3000);
     },this);
     this.cameras.main.fadeOut(0);
     var up = this.add.image(200,296,'up');
     var down = this.add.image(200,374,'down');
     var right = this.add.image(284,374,'right');
     var left = this.add.image(116,374,'left');

     var text2 = this.add.text(400,300,'Press left or right to move.\n\nPress up or down to change gravity.\n\nPress spacebar or shift to jump.',{
       font:'16px Courier'
     });
     var text3 = this.add.text(20,10,'How To Play',{font:'32px Courier'
     });
     var text1 = this.add.text(270,450,'- S T A R T -',{font:'32px Courier'
     });
     text1.setInteractive();
     text1.once('pointerup',function(){
       this.scene.start('Scene1');
       this.sound.stopAll();
     },this);
   }
 });
var Scene1 = new Phaser.Class({
  Extends:Phaser.Scene,
  initialize:
  function Scene1 ()
   {
       Phaser.Scene.call(this, { key: 'Scene1' });
   },
  preload:function()
  {
    this.load.audio('Gravitysound', [
          'Gravitysound.MP3'
    ]);
    this.load.audio('Gamesound', [
          'Gamesound.mp3'
    ]);
    this.load.audio('Diesound', [
          'diesound.mp3'
    ]);
    this.load.audio('Jumpsound', [
          'jumpsound.mp3'
    ]);
    this.load.audio('Teleportsound', [
          'teleportsound.mp3'
    ]);
    this.load.audio('stageclear', [
          'ClearStageSound.mp3'
    ]);
    this.load.spritesheet('dude','images/dude.png',{ frameWidth: 32, frameHeight: 48 });
    //spikes
    this.load.image('spike', 'images/spike.png');
    this.load.image('spikeUp', 'images/spike_up.png')
    this.load.image('spikeUpTileset', 'images/spike_up.png');
    //laser
    this.load.image('laser', 'images/laser.png');
    this.load.image('laserTileset', 'images/laser.png');
    this.load.image('laser2', 'images/laser2.png');
    this.load.image('laser2Tileset', 'images/laser2.png');
    //portal
    this.load.image('doorUpTileset', 'images/doorup.png');
    this.load.image('doorUp', 'images/doordown.png');
    this.load.image('doorDown', 'images/doorup.png');
    this.load.image('doorDownTileset', 'images/doordown.png');

    //map
    this.load.image('tiles', 'tilesets/platformPack_tilesheet.png');
    this.load.image('Back', 'images/back.png');
    //ClearDoor
    this.load.image('clear_door', 'images/clearDoor.png');
    // Load the export Tiled JSON
    this.load.tilemapTiledJSON('map', 'tilemaps/RealLevel1.json');
  },

  create:function()
  {

    Gravitys = this.sound.add('Gravitysound');
    var Gamebgm = this.sound.add('Gamesound');
    Gamebgm.play();
    Dies = this.sound.add('Diesound');
    this.time.addEvent({
      delay:148000,
      callback:()=>{
      Gamebgm.play();},
      loop:true
    })

    Jumps = this.sound.add('Jumpsound');
    TeleS = this.sound.add('Teleportsound');
    Stageclearsound = this.sound.add('stageclear');

    //map
    //backgroundImage.setScale(4);
    backgroundImage = this.add.image(0, 0,'Back').setOrigin(0, 0);
    backgroundImage = this.add.image(0, 1000,'Back').setOrigin(0, 0);
    backgroundImage = this.add.image(1000, 1000,'Back').setOrigin(0, 0);
    backgroundImage = this.add.image(2000, 2000,'Back').setOrigin(0, 0);
    backgroundImage = this.add.image(1500, 0,'Back').setOrigin(0, 0);
    backgroundImage = this.add.image(1500,1500,'Back').setOrigin(0, 0);

    map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64});

    tileset = map.addTilesetImage('platformPack_tilesheet', 'tiles');
    layer = map.createStaticLayer('GroundDown', tileset);
    layer.setCollisionByExclusion(-1, true);
    layerUp = map.createStaticLayer('GroundUp', tileset);
    layerUp.setCollisionByExclusion(-1, true);

    //player
    player = this.physics.add.sprite(100, 2300, 'dude');
    player.setBounce(0.1);
    player.setGravityY(1000);
    player.body.setSize(player.width-14, player.height).setOffset(7,0);
    //player.setCollideWorldBounds(true);

    this.physics.add.collider(player, layer);
    this.physics.add.collider(player, layerUp, checkThis, null, this);
    function checkThis() {
      isCollided = 1;
  }
    this.anims.create({ //이게 제일 좆같았던거 ㅅㅂ 캐릭터 움직임 애니메이션으로 만드는 것
        key: 'left', //이건 키가 left일 때 이렇다는 뜻
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }), //이미지 프레임중에서 0번부터3번 쓴다는 뜻
        frameRate: 10, //얼마나 빨리 돌릴지 숫자가 높을수록 그림 도는게 빨라짐
        repeat: -1 //이건 뭔지 모르겠다 ㅋ
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //카메라 이동 코드
    const camera = this.cameras.main;

    cursors = this.input.keyboard.createCursorKeys();//키보드 입력값을 받는 coursors인듯?

    camera.startFollow(player);
    camera.setBounds(0,0,map.widthInPixels, map.heightInPixels);

  //홍구 코드

  //clearDoor
    this.clearDoors = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const clearObjects = map.getObjectLayer('ClearDoor')['objects'];
    clearObjects.forEach(clearObject => {
    const clears = this.clearDoors.create(clearObject.x, clearObject.y - clearObject.height, 'clear_door').setOrigin(0, 0);
    clears.body.setSize(clears.width, clears.height).setOffset(0, 0);
  });
    this.physics.add.collider(player, this.clearDoors, CLEARSTAGE, null, this);
    //
    function CLEARSTAGE(player, clears) {
      this.sound.stopAll();
      Stageclearsound.play();
      this.scene.start('NextStage');
      player.setVelocity(0, 0);
      player.setX(100);
      player.setY(2300);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });

    }
  //laser
    this.lasers = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const laserObjects = map.getObjectLayer('Laser')['objects'];

    laserObjects.forEach(laserObject => {
    const laser = this.lasers.create(laserObject.x, laserObject.y - laserObject.height, 'laser').setOrigin(0, 0);
    laser.body.setSize(laser.width, laser.height-90).setOffset(0, 45);
  });

    this.physics.add.collider(player, this.lasers, playerHit, null, this);
  //laser2
    this.lasers2 = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const laser2Objects = map.getObjectLayer('Laser2')['objects'];

    laser2Objects.forEach(laser2Object => {
    const laser2 = this.lasers2.create(laser2Object.x, laser2Object.y - laser2Object.height, 'laser2').setOrigin(0, 0);
    laser2.body.setSize(laser2.width-90, laser2.height).setOffset(45, 0);
  });

    this.physics.add.collider(player, this.lasers2, playerHit, null, this);


  //spikeUp
    this.spikesUp = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    const spikeUpObjects = map.getObjectLayer('Spikes_up')['objects'];

    spikeUpObjects.forEach(spikeUpObject => {
    const spikeUp = this.spikesUp.create(spikeUpObject.x, spikeUpObject.y - spikeUpObject.height, 'spikeUp').setOrigin(0, 0);
    spikeUp.body.setSize(spikeUp.width-10, spikeUp.height - 50).setOffset(5, 0);
  });
    spikeUpObjects.forEach(spikeUpObject => {
    const spikeUp = this.spikesUp.create(spikeUpObject.x, spikeUpObject.y - spikeUpObject.height, 'spikeUp').setOrigin(0, 0);
    spikeUp.body.setSize(spikeUp.width-18, spikeUp.height - 50).setOffset(9, 10);
  });
    spikeUpObjects.forEach(spikeUpObject => {
    const spikeUp = this.spikesUp.create(spikeUpObject.x, spikeUpObject.y - spikeUpObject.height, 'spikeUp').setOrigin(0, 0);
    spikeUp.body.setSize(spikeUp.width-25, spikeUp.height - 50).setOffset(12, 20);
  });

    this.physics.add.collider(player, this.spikesUp, playerHit, null, this);

  //홍구 코드

    //spikes
    this.spikes = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    // Let's get the spike objects, these are NOT sprites
    const spikeObjects = map.getObjectLayer('Spikes')['objects'];

    // Now we create spikes in our sprite group for each object in our map
    spikeObjects.forEach(spikeObject => {
    const spike = this.spikes.create(spikeObject.x, spikeObject.y - spikeObject.height, 'spike').setOrigin(0, 0);
    spike.body.setSize(spike.width-10, spike.height - 50).setOffset(5, 50);
  });
    spikeObjects.forEach(spikeObject => {
    const spike = this.spikes.create(spikeObject.x, spikeObject.y - spikeObject.height, 'spike').setOrigin(0, 0);
    spike.body.setSize(spike.width-18, spike.height - 50).setOffset(9, 40);
  });
    spikeObjects.forEach(spikeObject => {
    const spike = this.spikes.create(spikeObject.x, spikeObject.y - spikeObject.height, 'spike').setOrigin(0, 0);
    spike.body.setSize(spike.width-25, spike.height - 50).setOffset(12, 30);
  });
    this.physics.add.collider(player, this.spikes, playerHit, null, this);

    function playerHit(player, spike) {
      diecount++;
      player.setVelocity(0, 0);
      player.setX(100);
      player.setY(2300);
      player.play('idle', true);
      player.setAlpha(0);
      Dies.play();
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }

    //portal


    this.DoorDownA1s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_A_1s = map.getObjectLayer('A_DoorDown')['objects'];

    doorDown_A_1s.forEach(doorDown_A_1 => {
    const doordownA1 = this.DoorDownA1s.create(doorDown_A_1.x, doorDown_A_1.y - doorDown_A_1.height, 'doorDown').setOrigin(0, 0);
    doordownA1.body.setSize(doordownA1.width, doordownA1.height).setOffset(0, 0);
  });

    this.physics.add.collider(player, this.DoorDownA1s, portalA1, null, this);
    function portalA1(player, doordownA1) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(1610);
      player.setY(630);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }
    this.DoorDownA2s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_A_2s = map.getObjectLayer('A_DoorDown2')['objects'];

    doorDown_A_2s.forEach(doorDown_A_2 => {
    const doordownA2 = this.DoorDownA2s.create(doorDown_A_2.x, doorDown_A_2.y - doorDown_A_2.height, 'doorDown').setOrigin(0, 0);
    doordownA2.body.setSize(doordownA2.width, doordownA2.height).setOffset(0, 0);
  });

    this.physics.add.collider(player, this.DoorDownA2s, portalA2, null, this);
    function portalA2(player, doordownA2) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(1785);
      player.setY(960);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }
    //portal2
    this.DoorDownB1s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_B_1s = map.getObjectLayer('B_DoorDown')['objects'];

    doorDown_B_1s.forEach(doorDown_B_1 => {
    const doordownB1 = this.DoorDownB1s.create(doorDown_B_1.x, doorDown_B_1.y - doorDown_B_1.height, 'doorDown').setOrigin(0, 0);
    doordownB1.body.setSize(doordownB1.width, doordownB1.height).setOffset(0, 0);
    });

    this.physics.add.collider(player, this.DoorDownB1s, portalB1, null, this);
    function portalB1(player, doordownB1) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(2590);
      player.setY(2100);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }
    this.DoorDownB2s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_B_2s = map.getObjectLayer('B_DoorDown2')['objects'];

    doorDown_B_2s.forEach(doorDown_B_2 => {
    const doordownB2 = this.DoorDownB2s.create(doorDown_B_2.x, doorDown_B_2.y - doorDown_B_2.height, 'doorUp').setOrigin(0, 0);
    doordownB2.body.setSize(doordownB2.width, doordownB2.height).setOffset(0, 0);
    });

    this.physics.add.collider(player, this.DoorDownB2s, portalB2, null, this);
    function portalB2(player, doordownB2) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(2120);
      player.setY(1600);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }
    water = map.createStaticLayer('Water', tileset);
    text4= this.add.text(82,2125,{font:'32px Courier'
    });
    keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)﻿;
  },
  update:function()
  {
    if(keyQ.isDown){
      player.setX(300);
      player.setY(200);
    }
    text4.setText('Death : '+diecount);
    if(isReverse==0)
    {
      player.body.setSize(player.width-14, player.height-10).setOffset(7,10);
      if (cursors.left.isDown)
      {
          player.setVelocityX(-200); //괄호 안이 속도 -가 붙은 이유는 왼쪽으로 가기 때문
          player.setFlipY(false);
          player.anims.play('left', true);
      }
      else if (cursors.right.isDown)
      {
          player.setVelocityX(200); //괄호 안이 속도 양수인 이유는 오른쪽으로 가기 때문
          player.setFlipY(false);
          player.anims.play('right', true);
      }
      else
      {
          player.setVelocityX(0);
          player.setFlipY(false);
          player.anims.play('turn');
      }
    }
    else if(isReverse==1)
    {
      player.body.setSize(player.width-14, player.height-10).setOffset(7,0);
      if (cursors.left.isDown)
      {
          player.setVelocityX(-200); //괄호 안이 속도 -가 붙은 이유는 왼쪽으로 가기 때문

          player.setFlipY(true);
          player.anims.play('left', true);
      }
      else if (cursors.right.isDown)
      {
          player.setVelocityX(200); //괄호 안이 속도 양수인 이유는 오른쪽으로 가기 때문

          player.setFlipY(true);
          player.anims.play('right', true);
      }
      else
      {
          player.setVelocityX(0);

          player.setFlipY(true);
          player.anims.play('turn');
      }
    }
    if (cursors.space.isDown && player.body.onFloor() && isReverse==0)
    {
      Jumps.play();
      player.setVelocityY(-520);
      isCollided=0;
    }
    else if(cursors.shift.isDown && isCollided==1 && isReverse==1)
    {
      Jumps.play();
      player.setVelocityY(520);
      isCollided = 0;
    }
    if(cursors.up.isDown)
    {
      Gravitys.play();
//       player.setGravityY(-1000);
//       isCollided = 0;
//       isReverse = 1;
    }
    else if(cursors.down.isDown && isCollided==1)
    {
//       player.setGravityY(1000);
//       isCollided=0;
//       isReverse = 0;
    }
  }
});
var NextStage = new Phaser.Class({
  Extends:Phaser.Scene,
  initialize:
  function NextStage(){
    Phaser.Scene.call(this,{key:'NextStage'});
  },
  create:function(){
    var text1 = this.add.text(270,270,'-Next Stage-',{font:'32px Courier'
    });
    var text2 = this.add.text(10,10,'Death : '+diecount,{font:'24px Courier'});
    text1.setInteractive();
    this.cameras.main.once('camerafadeoutcomplete',function(camera){
      camera.fadeIn(3000);
    },this);
    this.cameras.main.fadeOut(0);
    text1.once('pointerup',function(){
      this.scene.start('Scene2');
    },this);
  }
});
var Scene2 = new Phaser.Class({
  Extends:Phaser.Scene,
  initialize:
  function Scene2 ()
   {
       Phaser.Scene.call(this, { key: 'Scene2' });
   },
  preload:function()
  {
    this.load.audio('stageclear', [
          'ClearStageSound.mp3'
    ]);
    this.load.audio('Gravitysound', [
          'Gravitysound.MP3'
    ]);
    this.load.audio('Gamesound2', [
          'stage2music.mp3'
    ]);
    this.load.audio('Diesound', [
          'diesound.mp3'
    ]);
    this.load.audio('Jumpsound', [
          'jumpsound.mp3'
    ]);
    this.load.audio('Teleportsound', [
          'teleportsound.mp3'
    ]);
    this.load.spritesheet('dude','images/dude.png',{ frameWidth: 32, frameHeight: 48 });
    //spikes
    this.load.image('spike', 'images/spike.png');
    this.load.image('spikeUp', 'images/spike_up.png')
    this.load.image('spikeUpTileset', 'images/spike_up.png');
    //laser
    this.load.image('laser', 'images/laser.png');
    this.load.image('laserTileset', 'images/laser.png');
    this.load.image('laser2', 'images/laser2.png');
    this.load.image('laser2Tileset', 'images/laser2.png');
    //portal
    this.load.image('doorUpTileset', 'images/doorup.png');
    this.load.image('doorUp', 'images/doordown.png');
    this.load.image('doorDown', 'images/doorup.png');
    this.load.image('doorDownTileset', 'images/doordown.png');
    //map
    this.load.image('tiles', 'tilesets/platformPack_tilesheet.png');
    this.load.image('Back', 'images/back.png');
    this.load.image('box','images/box.png');
    this.load.image('clear_door', 'images/clearDoor.png');
    // Load the export Tiled JSON
    this.load.tilemapTiledJSON('map2', 'tilemaps/RealLevel2.json');
  },

  create:function()
  {
    Gravitys = this.sound.add('Gravitysound');
    var Gamebgm2 = this.sound.add('Gamesound2');
    Dies = this.sound.add('Diesound');
    Gamebgm2.play();
    this.time.addEvent({
      delay:119000,
      callback:()=>{
      Gamebgm2.play();},
      loop:true
    })
    Jumps = this.sound.add('Jumpsound');
    TeleS = this.sound.add('Teleportsound');
    Stageclearsound = this.sound.add('stageclear');

    //map
    //backgroundImage.setScale(4);
    backgroundImage = this.add.image(0, 0,'Back').setOrigin(0, 0);
    backgroundImage = this.add.image(0, 1000,'Back').setOrigin(0, 0);
    backgroundImage = this.add.image(1000, 1000,'Back').setOrigin(0, 0);
    backgroundImage = this.add.image(2000, 2000,'Back').setOrigin(0, 0);
    backgroundImage = this.add.image(1500, 0,'Back').setOrigin(0, 0);
    backgroundImage = this.add.image(1500,1500,'Back').setOrigin(0, 0);

    map2 = this.make.tilemap({ key: 'map2', tileWidth: 64, tileHeight: 64});

    tileset = map2.addTilesetImage('platformPack_tilesheet', 'tiles');
    layer = map2.createStaticLayer('GroundDown', tileset);
    layer.setCollisionByExclusion(-1, true);
    layerUp = map2.createStaticLayer('GroundUp', tileset);
    layerUp.setCollisionByExclusion(-1, true);

    //player
    player = this.physics.add.sprite(100,100, 'dude');
    player.setBounce(0.1);
    player.setGravityY(1000);
    player.body.setSize(player.width-14, player.height).setOffset(7,0);
    //player.setCollideWorldBounds(true);

    this.physics.add.collider(player, layer);
    this.physics.add.collider(player, layerUp, checkThis, null, this);
    function checkThis() {
      isCollided = 1;
  }
    this.anims.create({ //이게 제일 좆같았던거 ㅅㅂ 캐릭터 움직임 애니메이션으로 만드는 것
        key: 'left', //이건 키가 left일 때 이렇다는 뜻
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }), //이미지 프레임중에서 0번부터3번 쓴다는 뜻
        frameRate: 10, //얼마나 빨리 돌릴지 숫자가 높을수록 그림 도는게 빨라짐
        repeat: -1 //이건 뭔지 모르겠다 ㅋ
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //카메라 이동 코드
    const camera = this.cameras.main;

    cursors = this.input.keyboard.createCursorKeys();//키보드 입력값을 받는 coursors인듯?

    camera.startFollow(player);
    camera.setBounds(0,0,map2.widthInPixels, map2.heightInPixels);

  //홍구 코드
    this.clearDoors = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const clearObjects = map2.getObjectLayer('ClearDoor')['objects'];
    clearObjects.forEach(clearObject => {
    const clears = this.clearDoors.create(clearObject.x, clearObject.y - clearObject.height, 'clear_door').setOrigin(0, 0);
    clears.body.setSize(clears.width, clears.height).setOffset(0, 0);
  });
    this.physics.add.collider(player, this.clearDoors, CLEARSTAGE, null, this);
    //
    function CLEARSTAGE(player, clears) {
      this.sound.stopAll();
      Stageclearsound.play();
      this.scene.start('NextStage2');
      player.setVelocity(0, 0);
      player.setX(100);
      player.setY(2300);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
  }
  //laser
    this.lasers = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const laserObjects = map2.getObjectLayer('Laser')['objects'];

    laserObjects.forEach(laserObject => {
    const laser = this.lasers.create(laserObject.x, laserObject.y - laserObject.height, 'laser').setOrigin(0, 0);
    laser.body.setSize(laser.width, laser.height-90).setOffset(0, 45);
  });

    this.physics.add.collider(player, this.lasers, playerHit, null, this);
  //laser2
    this.lasers2 = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const laser2Objects = map2.getObjectLayer('Laser2')['objects'];

    laser2Objects.forEach(laser2Object => {
    const laser2 = this.lasers2.create(laser2Object.x, laser2Object.y - laser2Object.height, 'laser2').setOrigin(0, 0);
    laser2.body.setSize(laser2.width-90, laser2.height).setOffset(45, 0);
  });

    this.physics.add.collider(player, this.lasers2, playerHit, null, this);


  //spikeUp
    this.spikesUp = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    const spikeUpObjects = map2.getObjectLayer('Spikes_up')['objects'];

    spikeUpObjects.forEach(spikeUpObject => {
    const spikeUp = this.spikesUp.create(spikeUpObject.x, spikeUpObject.y - spikeUpObject.height, 'spikeUp').setOrigin(0, 0);
    spikeUp.body.setSize(spikeUp.width-10, spikeUp.height - 50).setOffset(5, 0);
  });
    spikeUpObjects.forEach(spikeUpObject => {
    const spikeUp = this.spikesUp.create(spikeUpObject.x, spikeUpObject.y - spikeUpObject.height, 'spikeUp').setOrigin(0, 0);
    spikeUp.body.setSize(spikeUp.width-18, spikeUp.height - 50).setOffset(9, 10);
  });
    spikeUpObjects.forEach(spikeUpObject => {
    const spikeUp = this.spikesUp.create(spikeUpObject.x, spikeUpObject.y - spikeUpObject.height, 'spikeUp').setOrigin(0, 0);
    spikeUp.body.setSize(spikeUp.width-25, spikeUp.height - 50).setOffset(12, 20);
  });

    this.physics.add.collider(player, this.spikesUp, playerHit, null, this);

  //홍구 코드

    //spikes
    this.spikes = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    // Let's get the spike objects, these are NOT sprites
    const spikeObjects = map2.getObjectLayer('Spikes')['objects'];

    // Now we create spikes in our sprite group for each object in our map
    spikeObjects.forEach(spikeObject => {
    const spike = this.spikes.create(spikeObject.x, spikeObject.y - spikeObject.height, 'spike').setOrigin(0, 0);
    spike.body.setSize(spike.width-10, spike.height - 50).setOffset(5, 50);
  });
    spikeObjects.forEach(spikeObject => {
    const spike = this.spikes.create(spikeObject.x, spikeObject.y - spikeObject.height, 'spike').setOrigin(0, 0);
    spike.body.setSize(spike.width-18, spike.height - 50).setOffset(9, 40);
  });
    spikeObjects.forEach(spikeObject => {
    const spike = this.spikes.create(spikeObject.x, spikeObject.y - spikeObject.height, 'spike').setOrigin(0, 0);
    spike.body.setSize(spike.width-25, spike.height - 50).setOffset(12, 30);
  });
    this.physics.add.collider(player, this.spikes, playerHit, null, this);

    function playerHit(player, spike) {
      diecount2++;
      player.setVelocity(0, 0);
      player.setX(100);
      player.setY(100);
      player.play('idle', true);
      player.setAlpha(0);
      Dies.play();
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }

  boxes = this.physics.add.sprite(1952, 733, 'box');
  boxes.setGravityY(1000);
  boxes.setGravityX(0);
  this.physics.add.collider(boxes, player, checkThis2, null, this);
  this.physics.add.collider(boxes, layer);
  this.physics.add.collider(boxes, layerUp);
  this.physics.add.collider(boxes, player, checkThis2, null, this);
  boxes.body.setSize(boxes.width, boxes.height).setOffset(0,0);
  function checkThis2() {
    isCollided = 1;
    boxes.setGravityX(0);
  }
  boxes4 = this.physics.add.sprite(2401, 733, 'box');
  boxes4.setGravityY(1000);
  boxes4.setGravityX(0);
  this.physics.add.collider(boxes4, player, checkThis2, null, this);
  this.physics.add.collider(boxes4, layer);
  this.physics.add.collider(boxes4, layerUp);
  this.physics.add.collider(boxes4, player, checkThis2, null, this);
  boxes4.body.setSize(boxes4.width, boxes4.height).setOffset(0,0);
  function checkThis2() {
    isCollided = 1;
    boxes.setGravityX(0);
  }
  boxes2 = this.physics.add.sprite(2144, 863, 'box');
  boxes2.setGravityY(1000);
  boxes2.setGravityX(0);
  this.physics.add.collider(boxes2, player, checkThis2, null, this);
  this.physics.add.collider(boxes2, layer);
  this.physics.add.collider(boxes2, layerUp);
  this.physics.add.collider(boxes2, player, checkThis2, null, this);
  boxes2.body.setSize(boxes2.width, boxes2.height).setOffset(0,0);
  function checkThis2() {
    isCollided = 1;
    boxes.setGravityX(0);
  }
  boxes3 = this.physics.add.sprite(2595, 863, 'box');
  boxes3.setGravityY(1000);
  boxes3.setGravityX(0);
  this.physics.add.collider(boxes3, player, checkThis2, null, this);
  this.physics.add.collider(boxes3, layer);
  this.physics.add.collider(boxes3, layerUp);
  this.physics.add.collider(boxes3, player, checkThis2, null, this);
  boxes3.body.setSize(boxes3.width, boxes3.height).setOffset(0,0);
  function checkThis2() {
    isCollided = 1;
    boxes.setGravityX(0);
  }



    //portal


    this.DoorDownA1s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_A_1s = map2.getObjectLayer('A_DoorDown')['objects'];

    doorDown_A_1s.forEach(doorDown_A_1 => {
    const doordownA1 = this.DoorDownA1s.create(doorDown_A_1.x, doorDown_A_1.y - doorDown_A_1.height, 'doorDown').setOrigin(0, 0);
    doordownA1.body.setSize(doordownA1.width, doordownA1.height).setOffset(0, 0);
  });

    this.physics.add.collider(player, this.DoorDownA1s, portalA1, null, this);
    function portalA1(player, doordownA1) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(1699);
      player.setY(220);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }
    this.DoorDownA2s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_A_2s = map2.getObjectLayer('A_DoorDown2')['objects'];

    doorDown_A_2s.forEach(doorDown_A_2 => {
    const doordownA2 = this.DoorDownA2s.create(doorDown_A_2.x, doorDown_A_2.y - doorDown_A_2.height, 'doorDown').setOrigin(0, 0);
    doordownA2.body.setSize(doordownA2.width, doordownA2.height).setOffset(0, 0);
  });

    this.physics.add.collider(player, this.DoorDownA2s, portalA2, null, this);
    function portalA2(player, doordownA2) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(2660);
      player.setY(1825);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }
    //portal2
    this.DoorDownB1s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_B_1s = map2.getObjectLayer('B_DoorDown')['objects'];

    doorDown_B_1s.forEach(doorDown_B_1 => {
    const doordownB1 = this.DoorDownB1s.create(doorDown_B_1.x, doorDown_B_1.y - doorDown_B_1.height, 'doorDown').setOrigin(0, 0);
    doordownB1.body.setSize(doordownB1.width, doordownB1.height).setOffset(0, 0);
    });

    this.physics.add.collider(player, this.DoorDownB1s, portalB1, null, this);
    function portalB1(player, doordownB1) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(2590);
      player.setY(2100);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }
    this.DoorDownB2s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_B_2s = map2.getObjectLayer('B_DoorDown2')['objects'];

    doorDown_B_2s.forEach(doorDown_B_2 => {
    const doordownB2 = this.DoorDownB2s.create(doorDown_B_2.x, doorDown_B_2.y - doorDown_B_2.height, 'doorUp').setOrigin(0, 0);
    doordownB2.body.setSize(doordownB2.width, doordownB2.height).setOffset(0, 0);
    });

    this.physics.add.collider(player, this.DoorDownB2s, portalB2, null, this);
    function portalB2(player, doordownB2) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(2120);
      player.setY(1600);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }

    water = map2.createStaticLayer('Water', tileset);
    text5= this.add.text(75,75,{font:'32px Courier'
    });

    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)﻿;
  },
  update:function()
  {
    if(keyW.isDown){
      player.setX(3035);
      player.setY(589);
    }
    text5.setText('Death : '+(diecount+diecount2));
    if(isReverse==0)
    {
      player.body.setSize(player.width-14, player.height-10).setOffset(7,10);
      if (cursors.left.isDown)
      {
          player.setVelocityX(-200); //괄호 안이 속도 -가 붙은 이유는 왼쪽으로 가기 때문
          player.setFlipY(false);
          player.anims.play('left', true);
      }
      else if (cursors.right.isDown)
      {
          player.setVelocityX(200); //괄호 안이 속도 양수인 이유는 오른쪽으로 가기 때문
          player.setFlipY(false);
          player.anims.play('right', true);
      }
      else
      {
          player.setVelocityX(0);
          player.setFlipY(false);
          player.anims.play('turn');
      }
    }
    else if(isReverse==1)
    {
      player.body.setSize(player.width-14, player.height-10).setOffset(7,0);
      if (cursors.left.isDown)
      {
          player.setVelocityX(-200); //괄호 안이 속도 -가 붙은 이유는 왼쪽으로 가기 때문

          player.setFlipY(true);
          player.anims.play('left', true);
      }
      else if (cursors.right.isDown)
      {
          player.setVelocityX(200); //괄호 안이 속도 양수인 이유는 오른쪽으로 가기 때문

          player.setFlipY(true);
          player.anims.play('right', true);
      }
      else
      {
          player.setVelocityX(0);

          player.setFlipY(true);
          player.anims.play('turn');
      }
    }
    if (cursors.space.isDown && player.body.onFloor() && isReverse==0)
    {
      Jumps.play();
      player.setVelocityY(-520);
      isCollided=0;
    }
    else if(cursors.shift.isDown && isCollided==1 && isReverse==1)
    {
      Jumps.play();
      player.setVelocityY(520);
      isCollided = 0;
    }
    if(cursors.up.isDown && player.body.onFloor())
    {
      Gravitys.play();
      player.setGravityY(-1000);
      boxes.setGravityY(-1000);
      boxes2.setGravityY(-1000);
      boxes3.setGravityY(-1000);
      boxes4.setGravityY(-1000);
      isCollided = 0;
      isReverse = 1;
    }
    else if(cursors.down.isDown && isCollided==1)
    {
      Gravitys.play();
      player.setGravityY(1000);
      boxes.setGravityY(1000);
      boxes2.setGravityY(1000);
      boxes3.setGravityY(1000);
      boxes4.setGravityY(1000);
      isCollided=0;
      isReverse = 0;
    }
  }
});
var NextStage2 = new Phaser.Class({
  Extends:Phaser.Scene,
  initialize:
  function NextStage2(){
    Phaser.Scene.call(this,{key:'NextStage2'});
  },
  create:function(){
    var text1 = this.add.text(270,270,'-Next Stage-',{font:'32px Courier'
    });
    var text2 = this.add.text(10,10,'Death : '+(diecount+diecount2),{font:'24px Courier'});
    text1.setInteractive();
    this.cameras.main.once('camerafadeoutcomplete',function(camera){
      camera.fadeIn(3000);
    },this);
    this.cameras.main.fadeOut(0);
    text1.once('pointerup',function(){
      this.scene.start('Scene3');
    },this);
  }
});
var Scene3 = new Phaser.Class({
  Extends:Phaser.Scene,
  initialize:
  function Scene3 ()
   {
       Phaser.Scene.call(this, { key: 'Scene3' });
   },
  preload:function()
  {
    this.load.audio('Gravitysound', [
          'Gravitysound.MP3'
    ]);
    this.load.audio('Gamesound3', [
          'laststagemusic.mp3'
    ]);
    this.load.audio('Diesound', [
          'diesound.mp3'
    ]);
    this.load.audio('Jumpsound', [
          'jumpsound.mp3'
    ]);
    this.load.audio('Teleportsound', [
          'teleportsound.mp3'
    ]);
    this.load.audio('stageclear', [
          'ClearStageSound.mp3'
    ]);
    this.load.spritesheet('dude','images/dude.png',{ frameWidth: 32, frameHeight: 48 });
    //spikes
    this.load.image('spike', 'images/spike.png');
    this.load.image('spikeUp', 'images/spike_up.png')
    this.load.image('spikeUpTileset', 'images/spike_up.png');
    //laser
    this.load.image('laser', 'images/laser.png');
    this.load.image('laserTileset', 'images/laser.png');
    this.load.image('laser2', 'images/laser2.png');
    this.load.image('laser2Tileset', 'images/laser2.png');
    //portal
    this.load.image('doorUpTileset', 'images/doorup.png');
    this.load.image('doorUp', 'images/doordown.png');
    this.load.image('doorDown', 'images/doorup.png');
    this.load.image('doorDownTileset', 'images/doordown.png');
    this.load.image('boxLarge','images/boxLarge.png');
    this.load.image('boxSmall','images/boxSmall.png');

    //map
    this.load.image('tiles', 'tilesets/platformPack_tilesheet.png');
    this.load.image('Back', 'images/back.png');
    //ClearDoor
    this.load.image('clear_door', 'images/clearDoor.png');
    // Load the export Tiled JSON
    this.load.tilemapTiledJSON('map3', 'tilemaps/realLevel3.json');
  },

  create:function()
  {
    Gravitys = this.sound.add('Gravitysound');
    var Gamebgm3 = this.sound.add('Gamesound3');
    Gamebgm3.play();
    Dies = this.sound.add('Diesound');
    this.time.addEvent({
      delay:111000,
      callback:()=>{
      Gamebgm3.play();},
      loop:true
    })

    Jumps = this.sound.add('Jumpsound');
    TeleS = this.sound.add('Teleportsound');
    Stageclearsound = this.sound.add('stageclear');

    //map
    //backgroundImage.setScale(4);
    backgroundImage = this.add.image(0, 0,'Back').setOrigin(0, 0);
    backgroundImage = this.add.image(0, 1000,'Back').setOrigin(0, 0);
    backgroundImage = this.add.image(1000, 1000,'Back').setOrigin(0, 0);
    backgroundImage = this.add.image(2000, 2000,'Back').setOrigin(0, 0);
    backgroundImage = this.add.image(1500, 0,'Back').setOrigin(0, 0);
    backgroundImage = this.add.image(1500,1500,'Back').setOrigin(0, 0);

    map3 = this.make.tilemap({ key: 'map3', tileWidth: 64, tileHeight: 64});

    tileset = map3.addTilesetImage('platformPack_tilesheet', 'tiles');
    layer = map3.createStaticLayer('GroundDown', tileset);
    layer.setCollisionByExclusion(-1, true);
    layerUp = map3.createStaticLayer('GroundUp', tileset);
    layerUp.setCollisionByExclusion(-1, true);

    //player
    player = this.physics.add.sprite(3000, 2300, 'dude');
    player.setBounce(0.1);
    player.setGravityY(1000);
    player.body.setSize(player.width-14, player.height).setOffset(7,0);
    //player.setCollideWorldBounds(true);

    this.physics.add.collider(player, layer);
    this.physics.add.collider(player, layerUp, checkThis, null, this);
    function checkThis() {
      isCollided = 1;
  }
    this.anims.create({ //이게 제일 좆같았던거 ㅅㅂ 캐릭터 움직임 애니메이션으로 만드는 것
        key: 'left', //이건 키가 left일 때 이렇다는 뜻
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }), //이미지 프레임중에서 0번부터3번 쓴다는 뜻
        frameRate: 10, //얼마나 빨리 돌릴지 숫자가 높을수록 그림 도는게 빨라짐
        repeat: -1 //이건 뭔지 모르겠다 ㅋ
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //카메라 이동 코드
    const camera = this.cameras.main;

    cursors = this.input.keyboard.createCursorKeys();//키보드 입력값을 받는 coursors인듯?

    camera.startFollow(player);
    camera.setBounds(0,0,map3.widthInPixels, map3.heightInPixels);

  //홍구 코드

  //clearDoor
    this.clearDoors = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const clearObjects = map3.getObjectLayer('ClearDoor')['objects'];
    clearObjects.forEach(clearObject => {
    const clears = this.clearDoors.create(clearObject.x, clearObject.y - clearObject.height, 'clear_door').setOrigin(0, 0);
    clears.body.setSize(clears.width, clears.height).setOffset(0, 0);
  });
    this.physics.add.collider(player, this.clearDoors, CLEARSTAGE, null, this);
    //
    function CLEARSTAGE(player, clears) {
      this.sound.stopAll();
      Stageclearsound.play();
      this.scene.start('Clear');
      player.setVelocity(0, 0);
      player.setX(100);
      player.setY(2300);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });

    }
  //laser
    this.lasers = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const laserObjects = map3.getObjectLayer('Laser')['objects'];

    laserObjects.forEach(laserObject => {
    const laser = this.lasers.create(laserObject.x, laserObject.y - laserObject.height, 'laser').setOrigin(0, 0);
    laser.body.setSize(laser.width, laser.height-90).setOffset(0, 45);
  });

    this.physics.add.collider(player, this.lasers, playerHit, null, this);
  //laser2
    this.lasers2 = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const laser2Objects = map3.getObjectLayer('Laser2')['objects'];

    laser2Objects.forEach(laser2Object => {
    const laser2 = this.lasers2.create(laser2Object.x, laser2Object.y - laser2Object.height, 'laser2').setOrigin(0, 0);
    laser2.body.setSize(laser2.width-90, laser2.height).setOffset(45, 0);
  });

    this.physics.add.collider(player, this.lasers2, playerHit, null, this);


  //spikeUp
    this.spikesUp = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    const spikeUpObjects = map3.getObjectLayer('Spikes_up')['objects'];

    spikeUpObjects.forEach(spikeUpObject => {
    const spikeUp = this.spikesUp.create(spikeUpObject.x, spikeUpObject.y - spikeUpObject.height, 'spikeUp').setOrigin(0, 0);
    spikeUp.body.setSize(spikeUp.width-10, spikeUp.height - 50).setOffset(5, 0);
  });
    spikeUpObjects.forEach(spikeUpObject => {
    const spikeUp = this.spikesUp.create(spikeUpObject.x, spikeUpObject.y - spikeUpObject.height, 'spikeUp').setOrigin(0, 0);
    spikeUp.body.setSize(spikeUp.width-18, spikeUp.height - 50).setOffset(9, 10);
  });
    spikeUpObjects.forEach(spikeUpObject => {
    const spikeUp = this.spikesUp.create(spikeUpObject.x, spikeUpObject.y - spikeUpObject.height, 'spikeUp').setOrigin(0, 0);
    spikeUp.body.setSize(spikeUp.width-25, spikeUp.height - 50).setOffset(12, 20);
  });

    this.physics.add.collider(player, this.spikesUp, playerHit, null, this);

  //홍구 코드

    //spikes
    this.spikes = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    // Let's get the spike objects, these are NOT sprites
    const spikeObjects = map3.getObjectLayer('Spikes')['objects'];

    // Now we create spikes in our sprite group for each object in our map
    spikeObjects.forEach(spikeObject => {
    const spike = this.spikes.create(spikeObject.x, spikeObject.y - spikeObject.height, 'spike').setOrigin(0, 0);
    spike.body.setSize(spike.width-10, spike.height - 50).setOffset(5, 50);
  });
    spikeObjects.forEach(spikeObject => {
    const spike = this.spikes.create(spikeObject.x, spikeObject.y - spikeObject.height, 'spike').setOrigin(0, 0);
    spike.body.setSize(spike.width-18, spike.height - 50).setOffset(9, 40);
  });
    spikeObjects.forEach(spikeObject => {
    const spike = this.spikes.create(spikeObject.x, spikeObject.y - spikeObject.height, 'spike').setOrigin(0, 0);
    spike.body.setSize(spike.width-25, spike.height - 50).setOffset(12, 30);
  });
    this.physics.add.collider(player, this.spikes, playerHit, null, this);

    function playerHit(player, spike) {
      diecount3++;
      player.setVelocity(0, 0);
      player.setX(3015);
      player.setY(2442);
      player.play('idle', true);
      player.setAlpha(0);
      Dies.play();
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }

    //portal


    this.DoorDownA1s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_A_1s = map3.getObjectLayer('A_DoorDown')['objects'];

    doorDown_A_1s.forEach(doorDown_A_1 => {
    const doordownA1 = this.DoorDownA1s.create(doorDown_A_1.x, doorDown_A_1.y - doorDown_A_1.height, 'doorDown').setOrigin(0, 0);
    doordownA1.body.setSize(doordownA1.width, doordownA1.height).setOffset(0, 0);
  });

    this.physics.add.collider(player, this.DoorDownA1s, portalA1, null, this);
    function portalA1(player, doordownA1) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(1060);
      player.setY(300);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }
    this.DoorDownA2s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_A_2s = map3.getObjectLayer('A_DoorDown2')['objects'];

    doorDown_A_2s.forEach(doorDown_A_2 => {
    const doordownA2 = this.DoorDownA2s.create(doorDown_A_2.x, doorDown_A_2.y - doorDown_A_2.height, 'doorUp').setOrigin(0, 0);
    doordownA2.body.setSize(doordownA2.width, doordownA2.height).setOffset(0, 0);
  });

    this.physics.add.collider(player, this.DoorDownA2s, portalA2, null, this);
    function portalA2(player, doordownA2) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(2850);
      player.setY(234);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }
    //portal2
    this.DoorDownB1s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_B_1s = map3.getObjectLayer('B_DoorDown')['objects'];

    doorDown_B_1s.forEach(doorDown_B_1 => {
    const doordownB1 = this.DoorDownB1s.create(doorDown_B_1.x, doorDown_B_1.y - doorDown_B_1.height, 'doorUp').setOrigin(0, 0);
    doordownB1.body.setSize(doordownB1.width, doordownB1.height).setOffset(0, 0);
    });

    this.physics.add.collider(player, this.DoorDownB1s, portalB1, null, this);
    function portalB1(player, doordownB1) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(1050);
      player.setY(610);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }
    this.DoorDownB2s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_B_2s = map3.getObjectLayer('B_DoorDown2')['objects'];

    doorDown_B_2s.forEach(doorDown_B_2 => {
    const doordownB2 = this.DoorDownB2s.create(doorDown_B_2.x, doorDown_B_2.y - doorDown_B_2.height, 'doorUp').setOrigin(0, 0);
    doordownB2.body.setSize(doordownB2.width, doordownB2.height).setOffset(0, 0);
    });

    this.physics.add.collider(player, this.DoorDownB2s, portalB2, null, this);
    function portalB2(player, doordownB2) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(1241);
      player.setY();
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }
    //portal3
    this.DoorDownC1s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_C_1s = map3.getObjectLayer('C_DoorDown')['objects'];

    doorDown_C_1s.forEach(doorDown_C_1 => {
    const doordownC1 = this.DoorDownC1s.create(doorDown_C_1.x, doorDown_C_1.y - doorDown_C_1.height, 'doorDown').setOrigin(0, 0);
    doordownC1.body.setSize(doordownC1.width, doordownC1.height).setOffset(0, 0);
  });

    this.physics.add.collider(player, this.DoorDownC1s, portalC1, null, this);
    function portalC1(player, doordownC1) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(1570);
      player.setY(350);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }
    this.DoorDownC2s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_C_2s = map3.getObjectLayer('C_DoorDown2')['objects'];

    doorDown_C_2s.forEach(doorDown_C_2 => {
    const doordownC2 = this.DoorDownC2s.create(doorDown_C_2.x, doorDown_C_2.y - doorDown_C_2.height, 'doorUp').setOrigin(0, 0);
    doordownC2.body.setSize(doordownC2.width, doordownC2.height).setOffset(0, 0);
  });

    this.physics.add.collider(player, this.DoorDownC2s, portalC2, null, this);
    function portalC2(player, doordownC2) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(1240);
      player.setY(480);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }

    //portal4
    this.DoorDownD1s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_D_1s = map3.getObjectLayer('D_DoorDown')['objects'];

    doorDown_D_1s.forEach(doorDown_D_1 => {
    const doordownD1 = this.DoorDownD1s.create(doorDown_D_1.x, doorDown_D_1.y - doorDown_D_1.height, 'doorDown').setOrigin(0, 0);
    doordownD1.body.setSize(doordownD1.width, doordownD1.height).setOffset(0, 0);
  });

    this.physics.add.collider(player, this.DoorDownD1s, portalD1, null, this);
    function portalD1(player, doordownD1) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(1178);
      player.setY(1117);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }
    this.DoorDownD2s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_D_2s = map3.getObjectLayer('D_DoorDown2')['objects'];

    doorDown_D_2s.forEach(doorDown_D_2 => {
    const doordownD2 = this.DoorDownD2s.create(doorDown_D_2.x, doorDown_D_2.y - doorDown_D_2.height, 'doorUp').setOrigin(0, 0);
    doordownD2.body.setSize(doordownD2.width, doordownD2.height).setOffset(0, 0);
  });

    this.physics.add.collider(player, this.DoorDownD2s, portalD2, null, this);
    function portalD2(player, doordownD2) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(1944);
      player.setY(174);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }

    //potal5
    this.DoorDownE1s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_E_1s = map3.getObjectLayer('E_DoorDown')['objects'];

    doorDown_E_1s.forEach(doorDown_E_1 => {
    const doordownE1 = this.DoorDownE1s.create(doorDown_E_1.x, doorDown_E_1.y - doorDown_E_1.height, 'doorDown').setOrigin(0, 0);
    doordownE1.body.setSize(doordownE1.width, doordownE1.height).setOffset(0, 0);
  });

    this.physics.add.collider(player, this.DoorDownE1s, portalE1, null, this);
    function portalE1(player, doordownE1) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(545);
      player.setY(2278);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }
    this.DoorDownE2s = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorDown_E_2s = map3.getObjectLayer('E_DoorDown2')['objects'];

    doorDown_E_2s.forEach(doorDown_E_2 => {
    const doordownE2 = this.DoorDownE2s.create(doorDown_E_2.x, doorDown_E_2.y - doorDown_E_2.height, 'doorDown').setOrigin(0, 0);
    doordownE2.body.setSize(doordownE2.width, doordownE2.height).setOffset(0, 0);
  });

    this.physics.add.collider(player, this.DoorDownE2s, portalE2, null, this);
    function portalE2(player, doordownE2) {
      TeleS.play();
      player.setVelocity(0, 0);
      player.setX(1252);
      player.setY(2079);
      player.play('idle', true);
      player.setAlpha(0);
      let tw = this.tweens.add({
        targets: player,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
      });
    }
    boxL = this.physics.add.sprite(2463, 2377, 'boxLarge');
    boxL.setGravityY(1000);
    boxL.setGravityX(0);
    this.physics.add.collider(boxL, player, checkThis3, null, this);
    this.physics.add.collider(boxL, layer);
    this.physics.add.collider(boxL, layerUp);
    this.physics.add.collider(boxL, player, checkThis3, null, this);
    boxL.body.setSize(boxL.width, boxL.height).setOffset(0,0);
    function checkThis3() {
      isCollided = 1;
      boxL.setGravityX(0);
    }
    boxS = this.physics.add.sprite(1758, 1506, 'boxSmall');
    boxS.setGravityY(1000);
    boxS.setGravityX(0);
    this.physics.add.collider(boxS, player, checkThis4, null, this);
    this.physics.add.collider(boxS, layer);
    this.physics.add.collider(boxS, layerUp);
    this.physics.add.collider(boxS, player, checkThis4, null, this);
    boxS.body.setSize(boxS.width, boxS.height).setOffset(0,0);
    function checkThis4() {
      isCollided = 1;
      boxS.setGravityX(0);
    }
    map3 = this.make.tilemap({ key: 'map3', tileWidth: 64, tileHeight: 64});

    tileset = map3.addTilesetImage('platformPack_tilesheet', 'tiles');
    layer = map3.createStaticLayer('GroundDown', tileset);
    layer.setCollisionByExclusion(-1, true);
    layerUp = map3.createStaticLayer('GroundUp', tileset);
    layerUp.setCollisionByExclusion(-1, true);
    text6= this.add.text(3020,2320,{font:'32px Courier'
    });

    keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)﻿;

  },
  update:function()
  {
    if(keyE.isDown){
      player.setX(200);
      player.setY(400);
    }
    text6.setText('Death : '+(diecount+diecount2+diecount3));
    if(isReverse==0)
    {
      player.body.setSize(player.width-14, player.height-10).setOffset(7,10);
      if (cursors.left.isDown)
      {
          player.setVelocityX(-200); //괄호 안이 속도 -가 붙은 이유는 왼쪽으로 가기 때문
          player.setFlipY(false);
          player.anims.play('left', true);
      }
      else if (cursors.right.isDown)
      {
          player.setVelocityX(200); //괄호 안이 속도 양수인 이유는 오른쪽으로 가기 때문
          player.setFlipY(false);
          player.anims.play('right', true);
      }
      else
      {
          player.setVelocityX(0);
          player.setFlipY(false);
          player.anims.play('turn');
      }
    }
    else if(isReverse==1)
    {
      player.body.setSize(player.width-14, player.height-10).setOffset(7,0);
      if (cursors.left.isDown)
      {
          player.setVelocityX(-200); //괄호 안이 속도 -가 붙은 이유는 왼쪽으로 가기 때문

          player.setFlipY(true);
          player.anims.play('left', true);
      }
      else if (cursors.right.isDown)
      {
          player.setVelocityX(200); //괄호 안이 속도 양수인 이유는 오른쪽으로 가기 때문

          player.setFlipY(true);
          player.anims.play('right', true);
      }
      else
      {
          player.setVelocityX(0);

          player.setFlipY(true);
          player.anims.play('turn');
      }
    }
    if (cursors.space.isDown && player.body.onFloor() && isReverse==0)
    {
      Jumps.play();
      player.setVelocityY(-520);
      isCollided=0;
    }
    else if(cursors.shift.isDown && isCollided==1 && isReverse==1)
    {
      Jumps.play();
      player.setVelocityY(520);
      isCollided = 0;
    }
    if(cursors.up.isDown && player.body.onFloor())
    {
      Gravitys.play();
      boxL.setGravityY(-1000);
      boxS.setGravityY(-1000);
      player.setGravityY(-1000);
      isCollided = 0;
      isReverse = 1;
    }
    else if(cursors.down.isDown && isCollided==1)
    {
      Gravitys.play();
      boxL.setGravityY(1000);
      boxS.setGravityY(1000);
      player.setGravityY(1000);

      isCollided=0;
      isReverse = 0;
    }
  }
});
var Clear = new Phaser.Class({
  Extends:Phaser.Scene,
  initialize:
  function Clear(){
    Phaser.Scene.call(this,{key:'Clear'});
  },
  preload:function(){

  },
  create:function(){
    total = diecount+diecount2+diecount3;
    var text1;

    if(total ==0)
    {
      text1 = this.add.text(125,200,'Your Score : S',{font:'64px Courier'
      });
    }
    else if(total>0 && total<10)
    {
      text1 = this.add.text(125,200,'Your Score : A',{font:'64px Courier'
      });
    }
    else if(total>10 && total<20)
    {
      text1 = this.add.text(125,200,'Your Score : B',{font:'64px Courier'
      });
    }
    else
    {
      text1 = this.add.text(125,200,'Your Score : C',{font:'64px Courier'
      });
    }
    var text2 = this.add.text(120,400,'- S T A R T  N E W  G A M E -',{font:'32px Courier'
    });
    var text3 = this.add.text(240,100,'GAME CLEAR',{font:'48px Courier'});
    text2.setInteractive();
    this.cameras.main.once('camerafadeoutcomplete',function(camera){
      camera.fadeIn(1500);
    },this);
    this.cameras.main.fadeOut(1);

    text2.once('pointerup',function(){
      this.scene.start('Menu');
    },this);
  }
});

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 1 },
        debug: false
    }
  },
  scene: [Menu,HowToPlay,Scene1,NextStage,Scene2,NextStage2,Scene3,Clear]
};
var game = new Phaser.Game(config);
