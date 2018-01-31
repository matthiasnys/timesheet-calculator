var fs = require('fs')
var fullDay = stringTimeToDecimal('08:40') // The amount to have at end of day.
var minTime = '07:00'
var maxTime = '18:04'

function calculateTimeSheet() {
    
    fs.readFile(__dirname + '/timesheet.txt', function (err, data) {
        if (err) throw err
    
        var lines = data.toString().split('\n')
        var overtime = 0
        for(var i=0;i<lines.length;i++)
        {
            var parsedLine = parseLine(lines[i])
            if (parsedLine != null) {
                console.log(parsedLine['date'] + " - " + parsedLine['start'] + ' - ' + parsedLine['end'] + " = " + decimalTimeToString(parsedLine['duration']) + " | " + decimalTimeToString(parsedLine['overtime']))
                overtime = overtime + parsedLine['overtime']
            }
        }
        
        console.log('Overtime for TimeSheet: ' + decimalTimeToString(overtime))
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
    if (trimmedLine.length <= 73) {
        //console.log('empty/no time line, stop!')
    } else if (trimmedLine.length <= 96) {
        var date = trimmedLine.substring(0, 10)
        var start = trimmedLine.substring(73, 78)
        var end = trimmedLine.substring(85, 90)
        var duration = parseDay(start, end)
        var overtime = checkOvertime(duration)
        var ret = {
            'date': date,
            'start': decimalTimeToString(Math.max(stringTimeToDecimal(minTime), stringTimeToDecimal(start))),
            'end': decimalTimeToString(Math.min(stringTimeToDecimal(maxTime), stringTimeToDecimal(end))),
            'duration': duration,
            'overtime': overtime 
        }
        //console.log(date + " - " + start + ' - ' + end + " = " + decimalTimeToString(duration) + " | " + decimalTimeToString(overtime))
        return ret
    }
    return null
    //console.log(trimmedLine)
}

function parseDay(start, end) {
    // -> 08:00 16:30 + make sure not to go out of bounds! (mintime/maxtime)
    var duration = Math.min(stringTimeToDecimal(maxTime), stringTimeToDecimal(end)) - Math.max(stringTimeToDecimal(minTime), stringTimeToDecimal(start))
    return duration
}

function decimalTimeToString(decimalTime) {
    // -> 16,5 -> 16:30
    var absoluteDecimalTime = Math.abs(decimalTime)
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
    calculateTime(timeOrNot)
}