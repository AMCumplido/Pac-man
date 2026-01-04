//Lectura de sprites
//Informacion de construccion
var widthSprite = 16;
var heightSprite = 16;
var graficos = false;
//Metodos
cargaIMG();

//Funciones
function constructorSprite(imgFuente, x, y, width, height){
    this.img = imgFuente;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dibuja = function(contexto, x, y){
        contexto.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width, this.height);
    }
}
function cargaIMG(){
    //sprites
    var imgSprite = new Image();
    imgSprite.src = "sprites.png";
    imgSprite.onload = function(){
        //Pacman
        var spriteID=0;
        for (var yS=0; yS<4; yS++){
            for(var xS=0; xS<2; xS++){
                var x = xS*widthSprite;
                var y = yS*heightSprite;
                pacmanList[spriteID] = new constructorSprite(imgSprite, x, y, widthSprite, heightSprite);
                spriteID++;
            }
        }
        pacmanList[spriteID] = new constructorSprite(imgSprite, 14*16, 0, widthSprite, heightSprite);
        spriteView(pacmanContext, pacmanList);
        //Pacman Death
        spriteID=0;
        for (var yS=0; yS<1; yS++){
            for(var xS=2; xS<12; xS++){
                var x = xS*widthSprite;
                var y = yS*heightSprite;
                pacmanDeathList[spriteID] = new constructorSprite(imgSprite, x, y, widthSprite, heightSprite);
                spriteID++;
            }
        }
        pacmanDeathList[spriteID] = new constructorSprite(imgSprite, 14*16, 0, widthSprite, heightSprite);
        spriteView(pacmanDeathContext, pacmanDeathList);
        //Fantasmas
        spriteID=0;
        for (var yS=0; yS<4; yS++){
            for(var xS=0; xS<8; xS++){
                var x = xS*widthSprite;
                var y = (yS+4)*heightSprite;
                fantasmasList[spriteID] = new constructorSprite(imgSprite, x, y, widthSprite, heightSprite);
                spriteID++;
            }
        }
        fantasmasList[spriteID] = new constructorSprite(imgSprite, 14*16, 0, widthSprite, heightSprite);
        spriteView(fantasmasContext, fantasmasList);
        //Fantasmas2
        spriteID=0;
        for (var yS=0; yS<2; yS++){
            for(var xS=8; xS<12; xS++){
                var x = xS*widthSprite;
                var y = (yS+4)*heightSprite;
                fantasmas2List[spriteID] = new constructorSprite(imgSprite, x, y, widthSprite, heightSprite);
                spriteID++;
            }
        }
        fantasmas2List[spriteID] = new constructorSprite(imgSprite, 14*16, 0, widthSprite, heightSprite);
        spriteView(fantasmas2Context, fantasmas2List);
        //Frutas
        spriteID=0;
        for (var yS=0; yS<1; yS++){
            for(var xS=2; xS<10; xS++){
                var x = xS*widthSprite;
                var y = (yS+3)*heightSprite;
                frutaList[spriteID] = new constructorSprite(imgSprite, x, y, widthSprite, heightSprite);
                spriteID++;
            }
        }
        frutaList[spriteID] = new constructorSprite(imgSprite, 14*16, 0, widthSprite, heightSprite);
        spriteView(frutasContext, frutaList);

        graficos = true;
    }

}
function spriteView(contexto, lista){  
    //para ver los sprites en los lienzos de muestreo 
    for(var i=0; i<lista.length; i++){
        lista[i].dibuja(contexto, i*16, 0);
    }
}
