const fs = require("fs");
function calendarService() {
  function syncDates(events) {
    let curr = new Date();
    let result = [];
    for (const event of events) {
      event.start = new Date(event.start);
      event.end = new Date(event.end);
    }
    for (let dayT of events) {
      for (let i = 1; i <= 6; i++) {
        let first = curr.getDate() - curr.getDay() + i ;
        let startTime = new Date(curr.setDate(first));
        let endTime = new Date(curr.setDate(first));

        if (startTime.getDay() === dayT.start.getDay()) {


          startTime.setHours(dayT.start.getHours());
          startTime.setMinutes(dayT.start.getMinutes());
          startTime.setSeconds(dayT.start.getSeconds());
          startTime.setMilliseconds(dayT.start.getMilliseconds());


          endTime.setHours(dayT.end.getHours());
          endTime.setMinutes(dayT.end.getMinutes());
          endTime.setSeconds(dayT.end.getSeconds());
          endTime.setMilliseconds(dayT.end.getMilliseconds());


          result.push({
            title: dayT.title,
            draggable: true,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            color: dayT.color,
            start: startTime,
            end: endTime,
          });
        }
      }
    }
    return result;
  }
  function deleteOldEvents(path) {
    fs.readdirSync(path).forEach((file) => {
      fs.unlinkSync(path + "/" + file);
    });
  }
  return { syncDates, deleteOldEvents };
}

module.exports = calendarService;
