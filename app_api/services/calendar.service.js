const fs = require("fs");
function calendarService() {
  function syncDates(events) {
    let curr = new Date();
    let result = [];
    for (const event of events) {
      event.start = new Date(event.start);
      event.end = new Date(event.end);
    }
    for (const dayT of events) {
      for (let i = 0; i <= 6; i++) {
        let first = curr.getDate() - curr.getDay() + i;
        let start = new Date(curr.setDate(first));
        let end = new Date(curr.setDate(first));
        if (start.getDay() === dayT.start.getDay()) {
          start.setHours(dayT.start.getHours());
          start.setMinutes(dayT.start.getMinutes());
          start.setSeconds(dayT.start.getSeconds());
          start.setMilliseconds(dayT.start.getMilliseconds());
          end.setHours(dayT.end.getHours());
          end.setMinutes(dayT.end.getMinutes());
          end.setSeconds(dayT.end.getSeconds());
          end.setMilliseconds(dayT.end.getMilliseconds());
          result.push({
            title: dayT.title,
            draggable: true,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            color: dayT.color,
            start,
            end,
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
