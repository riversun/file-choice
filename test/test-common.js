export function createHTML4OneDropArea() {
    // Set up our document body
    document.body.innerHTML =
        `<div id="file-drop-area" class="fc-drop-area">
    <div class="fc-drop-area-inside">
        <div class="fc-disp-default">
            <p>Drop here the files you want to handle</p>
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
</div>`;

}

/**
 * Returns File Object (png image file)
 * @returns {File}
 */
export function getImageFileForTest() {
    return dataURLtoFile(testImage, 'test.png');
}

const testImage = `data:image/png;base64,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`;

/**
 * Returns HTML5 File Object from base64 encoded DataURL
 * @param dataURL
 * @param filename
 * @returns {File}
 */
function dataURLtoFile(dataURL, filename) {

    const byteString = atob(dataURL.split(',')[1]);
    const size = byteString.length;
    const buffer = new Uint8Array(size);
    const mimeType = dataURL.match(/(:)([a-z\/]+)(;)/)[2];

    for (let i = 0; i < size; i++) {
        buffer[i] = byteString.charCodeAt(i);
    }

    return new File([buffer], filename, {type: mimeType});
}

export function setFilesToHTMLInputElement(htmlInputElement, files) {

    //Force set(overwrite) "files" property on HTMLInputElement(inputType=file) object.
    //https://www.bountysource.com/issues/27651584-expose-some-method-add-files-to-a-filelist
    Object.defineProperty(htmlInputElement, 'files', {
        value: files,
        writable: false,
    });

}

