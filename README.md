logwatch
========

`logwatch` is my first node.js app, written with the idea of seeing application debug log in an admin interface.

This specific implementation only worries about monitoring a file for changes and displaying results to a generic html front-end.

## Usage 

### Installing 

`git clone http://github.com/smazurov/logwatch.git`

only external module it uses is [`ws`](https://github.com/einaros/ws) by Einar Otto Stangvik &lt;einaros@gmail.com&gt;

### Running 

`> node index.js example/logs/example.log`

you can also generate a new log entry by running

`> node example/generateLogMessage.js`

then you should be able to navigate to `http://localhost:8080/` to see it in action.

## Caution &amp; Acknowledgments

This is a simple example and was created as an entry point into creating nodejs applications
It lacks advanced functionality while being somewhat "over the top" in structure and abstractions.

Thanks to **Nodejs tail -f log viewer** [gist](https://gist.github.com/867575) by [netroy](https://github.com/netroy) for inspiration. 

## License

(The MIT License)

Copyright (c) 2012 Stepan Mazurov &lt;smazurov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
