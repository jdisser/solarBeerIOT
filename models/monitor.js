/*
* Monitor creates a battery monitor to source simulation data to be persisted
* it creates a battery, panel and load
*
***/

function Monitor(){
    this.battery = new Battery();
    this.panel = new Panel();
    this.load = new Load();
    this.now = moment();
    this.count = 130;               //max number of records
    this.days = 5;                  //days in simulation
    this.minutes = 60;              //min between readings
    this.interval = moment.duration(this.minutes,'minutes');
    this.stopTime = moment(now).add(this.days,'days');
    
    var batteryData = {
      timeIndex: 0,
      batV: 0,
      batI: 0,
      batP: 0,
      batE: 0,
      bQtotal: 0,
      bC: 0
    };
    
    var batteryRecords = [];
    
    var systemData = {
      timeIndex: 0,
      eCharged: 0,
      eDischarged: 0,
      ahCumulative: 0,
      vBatMin: 0,
      vBatMax: 0,
      minDischarge: 0,
      lastDischarge: 0,
      avgDischarge: 0,
      discharges: 0,
      cycles: 0
    };
    
    var sysRecords = [];

 
    var timeStamp = function (moment){
        var tString = moment.format('X');
        var tStamp = parseInt(tString);
        return tStamp;
    }
    
    // get configuration from monitor.cfg
    var readConfig = function(){
        
    };
    
    /* set the configurable properties in the pamel, battery, and load if called
    *  using the data from the config file
    **/
    this.initMonitor = function(){
        
    };
    
    var genBatData = function(){
        
    };
    
    var genSysData = function(){
        
    };
    
    this.genData = function(){
        //This is the time loop...
        var loops = 0;
        while (this.now.isBefore(this.stopTime)){
            ++loops;
            if (loops > this.count) {
            break;
            }

            //code for generating data records within the Monitor goes here    

            this.now.add(this.interval); //iterate the time loop here
        }
        
    };
}
