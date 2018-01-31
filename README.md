# timesheet-calculator
Calculate timesheets based on certain timesheet.txt

It take an input of your timesheets and calculates how much overtime you have for this timesheet.

### Input (txt file)
```bash
  07/01/2018      0,00       0:00 Leeg Leeg Leeg Leeg Leeg Leeg       0:00
  08/01/2018      0,00       0:00 Leeg Leeg Leeg Leeg Leeg Leeg       0:00 08:30 P01 E 17:40 P01 E
  09/01/2018      0,00       0:00 Leeg Leeg Leeg Leeg Leeg Leeg       0:00 08:37 P01   17:28 P01
  10/01/2018      0,00       0:00 Leeg Leeg Leeg Leeg Leeg Leeg       0:00 08:15 P01   16:27 P01
```

### Output (terminal)
```bash
08/01/2018 -  08:30 -  17:40 =  09:10 |  00:30
09/01/2018 -  08:37 -  17:28 =  08:51 |  00:11
10/01/2018 -  08:15 -  16:27 =  08:12 | -00:28
Overtime for TimeSheet:  00:13
```
## prerequisites

- Node.js (preferably the last version: 9.4.0

## Use

### making the timesheets.txt

Copy it form the example one
```bash
cp timesheet-example.txt timesheet.txt
```

It uses a certain format (the choosen one is something I can get very easy from the internal tool).
Edit the file using your favorite editor.

```bash
node index.js
```

### configuring the business logic

In my current business a full day takes 8h40m (40min lunchbreak). So change the `fullDay` string to something that fits your needs.
Next to that hours before 7h00 and after 18h04 are declined. So I added a `minTime` and `maxTime`. Feel free to change them as well.

### Calculating your current day

Some added feature is to calculate when you can leave to get on track with the timetracking.

## Next steps

- Link it to my invoicing system (create the entries in harvest automatic)
- Calculate the invoice amount (with daily rate)
- An API (JSON REST webservice)
- Your suggestion?
