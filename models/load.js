/*
* Model Constructor: Load
*
* Usage: load = new Load();
*
* load.getLoadI returns a current in mA set by iLoadLimit
* with a random component of magnitude iRandom
*
*
****/
function Load(){
    this.iRandom = 200;       //random fluctuation component of load current in mA
    this.iLoadLimit = 2000;   //steady state load current
    
    this.getLoadI = function(){
        //return Math.floor(this.iLoadLimit + this.iRandom * Math.random);
        return Math.floor(this.iLoadLimit + (Math.random() * this.iRandom));
    }
}

module.exports = Load;