// TimeUtility.js

class TimeUtility {
    static getCurrentHour() {
      return new Date().getHours();
    }
  
    static isNightTime() {
      const currentHour = this.getCurrentHour();
      return currentHour >= 20 || currentHour < 6; // Night time between 8 PM and 6 AM
    }
  }
  
  export default TimeUtility;