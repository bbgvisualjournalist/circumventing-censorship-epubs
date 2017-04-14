# circumventing-censorship
VOA created [a website](http://projects.voanews.com/circumvention/) promoting online tools to help people circumvent government censorship efforts. We want to republish the content as ebooks that can be downloaded and shared. We also needed a way to simplify the addition and editing of meta data and translations. 

We're using the ePub3 format, which is basically a series of XHTML documents that are zipped together using a very specific structure. The idea of manually trying copy and paste the text into the appropriate tags throughout the book seemed tedious and destined for errors.

### How it works ###
I created an Express Node application that uses a Google spreadsheet to provide the translations and metadata. [The spreadsheet](https://docs.google.com/spreadsheets/d/123DWrahipU6XOVjnVdTd0kdOBFBlzXuxButFymJ-OmA/pubhtml) has sheets for each tool as well as general translations. We shared the document with editors who can provide translations and corrections. 

I'm using [Tabletop.js](https://github.com/jsoma/tabletop) to simplify working with the published spreadsheet. I save the data to a series of JSON files. I use setInterval to periodically update the files with edits from the spreadsheets.

By using a single source for the data, I can ensure that changes to chapter titles are accurately reflected in the table of contents and the chapter itself. That images that appear in the book are listed in the required content.opf document. And that edits remain current.

To run the application, download the JSON and serve the files:
* Switch to the `bin` directoy
* run `$ node www`

### Downloading the ebooks ###
I wrote a [simple app](https://github.com/bbgvisualjournalist/download-circumvention-ebooks) for downloading and compiling the various components of each epub translation.
