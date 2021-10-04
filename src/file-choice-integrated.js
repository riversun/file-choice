import { default as FileChoice } from './file-choice';
import EventEmitter from '@riversun/event-emitter';

/**
 * This class enables file drag drop for an element with 'fc-drop-area' specified as CSS class name.
 *
 * If there are multiple elements with fc-drop-area in the dom tree, all of them will be drag-drop enabled.
 */
export default class FileChoiceIntegrated {

  /**
   * To enable the paste of image data on the clipboard,
   * set constructor option to {pasteEnabled:true}
   * @param opts
   */
  constructor(opts) {

    this.eventEmitter = new EventEmitter();
    this.pasteEnabled = false;
    this.fileChoiceStore = new Map();

    if (opts) {
      if (opts.pasteEnabled) {
        this.pasteEnabled = true;
      }
    }

    if (this.pasteEnabled) {
      this._enablePaste();
    }

    this._searchAndBuildDropAreas();
  }

  _searchAndBuildDropAreas() {
    const areas = document.querySelectorAll('.fc-drop-area');

    for (const area of areas) {

      const fileChoice = new FileChoice({
        dropArea: area
      });

      fileChoice.events().pipe(this.eventEmitter);

      //cache drop areas
      this.fileChoiceStore.set(area, fileChoice);
    }
  }

  /**
   * Execute 'filedrop' event manually
   * @param files
   * @param {Element} [targetDropArea=first discovered '.fc-drop-area' element ]
   */
  doDrop(files, targetDropArea) {

    if (targetDropArea) {
      const fileChoice = this.fileChoiceStore.get(targetDropArea);
      if (fileChoice) {
        fileChoice.doDrop(files);
      }
    } else {
      //Get first fileChoice object in this.fileChoiceStore

      const firstFileChoice = this.fileChoiceStore.values().next().value;
      if (firstFileChoice) {
        firstFileChoice.doDrop(files);
      }

    }
  }

  doPaste(pastedItemMap, targetDropArea) {

    if (targetDropArea) {
      const fileChoice = this.fileChoiceStore.get(targetDropArea);
      if (fileChoice) {
        fileChoice.doPaste(pastedItemMap);
      }
    } else {
      //Get first fileChoice object in this.fileChoiceStore

      const firstFileChoice = this.fileChoiceStore.values().next().value;
      if (firstFileChoice) {
        firstFileChoice.doPaste(pastedItemMap);
      }

    }
  }

  _enablePaste() {
    document.addEventListener('paste', async (e) => {

      e.preventDefault();
      const clipboardItems = e.clipboardData.items;

      // handling "file" type pasted items
      for (let clipboardItem of clipboardItems) {
        if (clipboardItem.kind === 'file') {
          const fileOnClipboard = clipboardItem.getAsFile();
          this.doDrop([fileOnClipboard], null);
        }
      }

      // handling "string" type pasted items
      const pastedStringItemMap = new Map();
      for (let clipboardItem of clipboardItems) {
        if (clipboardItem.kind === 'string') {
          pastedStringItemMap.set(clipboardItem.type, clipboardItem);
        }
      }
      this.doPaste(pastedStringItemMap, null);

    });
  }

  /**
   * Get string from clipboardItem
   * @param clipboardItem
   * @returns {Promise<unknown>}
   */
  async getStringFromClipboardItemAsync(clipboardItem) {
    return new Promise((resolve) => {
      if (clipboardItem.kind === 'string') {
        clipboardItem.getAsString((str) => {
          resolve(str);
        });
      } else {
        resolve(null);
      }
    });
  }

  /**
   * Get image object from HTML5 File Object
   * @param file
   * @param {Function} [callbackFunc] if callbackFunc isn't specified,returns image object synchronously
   */
  getImageFromFileAsync(file) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        resolve(image);
      };
      image.src = URL.createObjectURL(file);
    });
  }

  /**
   * Get image object from HTML5 File Object
   * @param file
   * @param {Function} [callbackFunc] if callbackFunc isn't specified,returns image object synchronously
   */
  getImageFromFile(file, callbackFunc) {
    const image = new Image();
    if (callbackFunc) {

      image.onload = () => {
        callbackFunc(image);
      };
      image.src = URL.createObjectURL(file);

    } else {
      image.src = URL.createObjectURL(file);
      return image;
    }
  }

  events() {
    return this.eventEmitter;
  }
}
