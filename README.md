# file-choice
 
Helper library for dragging and dropping files.
 
This library allows you to do the following:
 - Files can be obtained by drag and drop
 - Click on the link to browse local files
 - You can paste the image data on the clipboard and get it as a file
 
# Install

- **NPM**

```
npm install file-choice
```

or 

- **use `<script>` tag** 


```html                                      
<script src="https://riversun.github.io/file-choice/js/file-choice.js"></script>
```

# Usage

## HTML
 
Here is the typical html for file-choice

'file-choice' enables file drag & drop function for an element with 'fc-drop-area' specified as CSS class name.

If there are multiple elements with fc-drop-area in the dom tree, all of them will be drag-drop enabled.

![filechoice_ex1](https://user-images.githubusercontent.com/11747460/74494346-25310380-4f18-11ea-86e3-dbcc8327f6bd.gif)

 
 ```html
<div id="file-drop-area" class="fc-drop-area">
    <div class="fc-drop-area-inside">
        <div class="fc-disp-default">
            <p>You can paste an image from the clipboard as well as dropping a file.</p>
        </div>
        <div class="fc-disp-drag">
            <p>Drop here to add the file</p>
        </div>
        <div class="fc-disp-drag-not-allow">
            <p>The object cannot be dropped</p>
        </div>
        <p class="fc-visible-default">OR</p>
        <div class="fc-file-ref">
            <span>Select file</span>
        </div>
    </div>
</div>
``` 
 
 
 ## Code
 
 By creating a `FileChoice` object and setting an event handler by 
  `fileChoice.events().on('filedrop', (data) => {});`, you can get the file that was dropped or picked up from the dialog.
 
 ```javascript 
import {FileChoice} from 'file-choice';// for npm environment

    const fileChoice = new FileChoice();

    //set 'filedrop' event of file-choice
    fileChoice.events().on('filedrop', (data) => {

        //data.target is the element with class="fc-drop-area".
        const target = data.target;
        const files = data.files;

        const droppedFileInfo = [];

        for (const file of files) {

            droppedFileInfo.push(
                {
                    name: file.name,
                    size: file.size,
                    type: file.type
                }
            );
        }

        alert(JSON.stringify(droppedFileInfo));
    });


```


## Enable "paste" from Clipboard

Create `FileChoice` object with option like below.

You can paste "image" data as a file by "ctrl+V" from clipboard.

```javascript
    const fileChoice = new FileChoice({
        pasteEnabled: true
    });

```

![filechoice_ex2](https://user-images.githubusercontent.com/11747460/74494349-295d2100-4f18-11ea-9073-b804a100b320.gif)


# Demo

https://riversun.github.io/file-choice
