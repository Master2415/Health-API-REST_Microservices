
class Log {
    constructor(ID, app_name, log_type, module, log_date_time, summary, description) {
      this.ID = ID;
      this.app_name = app_name;
      this.log_type = log_type;
      this.module = module;
      this.log_date_time = log_date_time;
      this.summary = summary;
      this.description = description;
    }
  }  

module.exports = Log;
