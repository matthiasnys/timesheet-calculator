var fs = require('fs')
var fullDay = stringTimeToDecimal('08:40') // The amount to have at end of day.
var minTime = stringTimeToDecimal('07:00') // From When you can start
var maxTime = stringTimeToDecimal('18:04') // Till when you have to stop

function calculateTimeSheet() {
    
    console.log("DATE          START    END      TOTAL   OVER     BILL") // Print a HEADER

    fs.readFile(__dirname + '/timesheet.txt', function (err, data) {
        if (err) throw err
    
        var lines = data.toString().split('\n')
        var overtime = 0
        for(var i=0;i<lines.length;i++)
        {
            var parsedLine = parseLine(lines[i])
            if (parsedLine != null) {
                console.log(parsedLine['date'] + " - " + parsedLine['start'] + ' - ' + parsedLine['end'] + " = " + decimalTimeToString(parsedLine['duration']) + " |" + decimalTimeToString(parsedLine['overtime']) + " | " + decimalTimeToString(8.0 + parsedLine['overtime']) )
                overtime = overtime + parsedLine['overtime']
            }
        }
        console.log('Overtime for TimeSheet: ' + decimalTimeToString(overtime))
        readAndCalculateTime()
    })
}

function writeTodayTime(timeString) {
    fs.writeFile(__dirname + '/today.txt', timeString)
}

function readAndCalculateTime() {
    fs.readFile(__dirname + '/today.txt', function (err, data) {
        calculateTime(data.toString())
    })
}

function calculateTime(timeString) {
    var d = new Date()
    var h = d.getHours()
    var m = d.getMinutes()
    currentHourString = pad(h, 2) + ":" + pad(m, 2)
    var duration = parseDay(timeString, currentHourString)
    var overtime = checkOvertime(duration)
    var eta = stringTimeToDecimal(timeString) + fullDay

    console.log("Currently" + decimalTimeToString(duration) + " => " + decimalTimeToString(overtime) + " ETD: " + decimalTimeToString(eta))
}


function parseLine(line) {
    var trimmedLine = line.trim()

    if (trimmedLine.length > 73 && trimmedLine.length <= 96) {
        var date = trimmedLine.substring(0, 10)
        var start = trimmedLine.substring(73, 78)
        var end = trimmedLine.substring(85, 90)
        var duration = parseDay(start, end)
        var overtime = checkOvertime(duration)
        var ret = {
            'date': date,
            'start': decimalTimeToString(Math.max(minTime, stringTimeToDecimal(start))),
            'end': decimalTimeToString(Math.min(maxTime, stringTimeToDecimal(end))),
            'duration': duration,
            'overtime': overtime 
        }
        return ret
    }
    return null
}

function parseDay(start, end) {
    // -> 08:00 16:30 + make sure not to go out of bounds! (mintime/maxtime)
    var duration = Math.min(maxTime, stringTimeToDecimal(end)) - Math.max(minTime, stringTimeToDecimal(start))
    return duration
}

function decimalTimeToString(decimalTime) {
    // -> 16,5 -> 16:30
    var absoluteDecimalTime = Math.abs(decimalTime)
    if (absoluteDecimalTime < 0.001) {
        return " 00:00"
    }
    var hours = pad(parseInt(absoluteDecimalTime, 10), 2)
    var minutes = pad(Math.round((absoluteDecimalTime - hours) * 60.0), 2)
    
    var minus = decimalTime < 0.0 ? "-" : " "
    return minus + hours + ":" + minutes
}

function stringTimeToDecimal(stringTime) {
    // -> 16:30 -> 16,5
    var timeArray = stringTime.split(':');
    var decimalTime = parseInt(timeArray[0], 10) + parseInt(timeArray[1], 10)/60.0 //Make decimal
    return decimalTime
}

function checkOvertime(duration) {
    return duration - fullDay
}

function pad(num, size) {
    var s = num + ""
    while (s.length < size) s = "0" + s
    return s
}


// START

var timeOrNot = process.argv[2]
if (timeOrNot == null) {
    calculateTimeSheet()
} else {
    writeTodayTime(timeOrNot)
    calculateTime(timeOrNot)
}