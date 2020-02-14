import EventEmitter from '@riversun/event-emitter';

/**
 * Helper class for selecting files in the following way
 *
 * - Drag and drop files
 * - File reference link
 *
 * @author Tom Misawa (riversun.org@gmail.com,https://github.com/riversun)
 */
export default class FileChoice {

    constructor(opts) {

        //class name of dragover
        this.DRAG_OVER_CLS_NAME = 'dragover';
        this.DRAG_OVER_NOT_ALLOWED_CLS_NAME = 'dragover-not-allowed';

        if (opts && opts.dropArea) {
            this.fileDropAreaEle = opts.dropArea;
        } else {
            this.fileDropAreaEle = document.querySelector('.fc-drop-area');
        }

        const fcFileRefEle = this.fileDropAreaEle.querySelector('.fc-drop-area-inside .fc-file-ref');

        if (fcFileRefEle) {

            //cleary specified by fileInputRef tags
            this.fileInputEle = this.fileDropAreaEle.querySelector('.fc-file-ref .fc-input');
            this.fileInputLinkEle = this.fileDropAreaEle.querySelector('fc-file-ref a');

            const hasUsersFileRef = this.fileInputEle && this.fileInputLinkEle;

            if (!hasUsersFileRef) {

                const refHtml = fcFileRefEle.innerHTML.trim();
                fcFileRefEle.innerHTML = '';

                const inputEle = document.createElement('input');
                inputEle.setAttribute('type', 'file');
                inputEle.classList.add('fc-input');

                const linkEle = document.createElement('a');
                linkEle.setAttribute('href', '');
                linkEle.innerHTML = refHtml;


                fcFileRefEle.appendChild(inputEle);
                fcFileRefEle.appendChild(linkEle);

                this.fileInputEle = inputEle;
                this.fileInputLinkEle = linkEle;
            }
        }


        this.nonFileObjectDragging = false;

        this.enterLeaveNum = 0;

        this._setEvents();

        this.eventEmitter = new EventEmitter(['filedrop']);
    }


    events() {
        return this.eventEmitter;
    }

    getTargetUploadArea() {
        return this.fileDropAreaEle;
    }


    /**
     * Register an event that occurs from the DOM element of the drop area
     *
     * @private
     */
    _setEvents() {

        if (this.fileInputLinkEle) {
            //Show file reference dialog when clicking the "Select File" link
            this.fileInputLinkEle.addEventListener('click', evt => {
                this.fileInputEle.click();
                evt.preventDefault();
            });
        }

        if (this.fileInputEle) {
            //Add a file when a file is selected on the file reference dialog
            this.fileInputEle.addEventListener('change', evt => {

                const selectedFiles = evt.target.files;

                //Add dropped file(s).
                this.doDrop(selectedFiles);
            });
        }


        this.fileDropAreaEle.addEventListener('dragenter', evt => {

            evt.preventDefault();

            // If there is a child element in the file drop area
            // Count enter/leave to ignore "dragenter"/"dragleave" event in child element
            this.enterLeaveNum++;

            const draggingObjectTypes = evt.dataTransfer.types;


            // If dragging objects contains "file" type object,
            // then set a flag to indicate that it can be dropped
            let draggingObjectContainsFile = false;

            for (const draggingObjectType of draggingObjectTypes) {
                if (draggingObjectType === 'Files') {
                    draggingObjectContainsFile = true;
                    break;
                }
            }

            if (!draggingObjectContainsFile) {
                this.nonFileObjectDragging = true;
            } else {
                this.nonFileObjectDragging = false;
            }


            if (this.nonFileObjectDragging) {
                this.fileDropAreaEle.style.cursor = 'not-allowed';
                this.fileDropAreaEle.classList.add(this.DRAG_OVER_NOT_ALLOWED_CLS_NAME);
                return;
            } else {
                this.fileDropAreaEle.style.cursor = 'default';
                this.fileDropAreaEle.classList.add(this.DRAG_OVER_CLS_NAME);
                return;
            }

        });

        this.fileDropAreaEle.addEventListener('dragover', evt => {

            if (this.nonFileObjectDragging) {
                //Return here to show 'forbidden' icon.
                return;
            }
            evt.preventDefault();
        });

        this.fileDropAreaEle.addEventListener('dragleave', evt => {

            this.enterLeaveNum--;

            if (this.enterLeaveNum === 0) {
                //When it comes out of the parent element (dragleave)

                if (this.nonFileObjectDragging) {
                    this.nonFileObjectDragging = false;
                    this.fileDropAreaEle.style.cursor = 'default';
                    this.fileDropAreaEle.classList.remove(this.DRAG_OVER_NOT_ALLOWED_CLS_NAME);
                } else {
                    this.fileDropAreaEle.classList.remove(this.DRAG_OVER_CLS_NAME);
                }

            }

        });

        this.fileDropAreaEle.addEventListener('drop', evt => {

            evt.stopPropagation();
            evt.preventDefault();

            this.enterLeaveNum = 0;

            if (this.nonFileObjectDragging) {
                this.nonFileObjectDragging = false;
                this.fileDropAreaEle.style.cursor = 'default';
                this.fileDropAreaEle.classList.remove(this.DRAG_OVER_NOT_ALLOWED_CLS_NAME);
                return;//Skip adding dropped file.

            } else {
                this.fileDropAreaEle.classList.remove(this.DRAG_OVER_CLS_NAME);
            }

            const selectedFiles = evt.dataTransfer.files;

            //Add dropped file(s).
            this.doDrop(selectedFiles);

        });

    }

    /**
     * Raise "filedrop" event
     * @param files
     */
    doDrop(files) {
        this.eventEmitter.emit('filedrop', {
            target: this.fileDropAreaEle,
            files: files
        });
    }


}
