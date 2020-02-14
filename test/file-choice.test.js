import FileChoice from '../src/file-choice';
import {createHTML4OneDropArea, getImageFileForTest, setFilesToHTMLInputElement} from './test-common';


describe('FileChoice', () => {

    describe('File drag and drop', () => {

        test('Check single file drop', (done) => {

            createHTML4OneDropArea();

            const fileChoice = new FileChoice();
            const targetUploadArea = fileChoice.getTargetUploadArea();

            const testFile = getImageFileForTest();

            //create event
            const changeEvent = new Event('drop', {});
            changeEvent.dataTransfer = {files: [testFile]};

            fileChoice.events().on('filedrop', (data) => {


                const target = data.target;
                const files = data.files;

                const file = files[0];

                expect(file.name).toBe(testFile.name);
                expect(file.type).toBe(testFile.type);
                expect(file.size).toBe(testFile.size);
                expect(target).toBe(fileChoice.getTargetUploadArea());

                done();
            });

            targetUploadArea.dispatchEvent(changeEvent);

        });
        test('Check multiple files drop', (done) => {

            createHTML4OneDropArea();

            const fileChoice = new FileChoice();
            const targetUploadArea = fileChoice.getTargetUploadArea();

            const testFile = getImageFileForTest();
            const testFiles = [testFile, testFile, testFile];
            //create event
            const changeEvent = new Event('drop', {});
            changeEvent.dataTransfer = {files: testFiles};

            fileChoice.events().on('filedrop', (data) => {


                const target = data.target;
                const files = data.files;

                expect(files.length).toBe(testFiles.length);

                const file0 = files[0];

                expect(file0.name).toBe(testFile.name);
                expect(file0.type).toBe(testFile.type);
                expect(file0.size).toBe(testFile.size);

                const file1 = files[1];

                expect(file1.name).toBe(testFile.name);
                expect(file1.type).toBe(testFile.type);
                expect(file1.size).toBe(testFile.size);

                const file2 = files[2];

                expect(file2.name).toBe(testFile.name);
                expect(file2.type).toBe(testFile.type);
                expect(file2.size).toBe(testFile.size);

                expect(target).toBe(fileChoice.getTargetUploadArea());

                done();
            });

            targetUploadArea.dispatchEvent(changeEvent);

        });
    });


    describe('File selection ref link', () => {
        test('Check events', (done) => {

            createHTML4OneDropArea();

            const fileChoice = new FileChoice();

            const inputEle = document.querySelector('.fc-input');

            //create event
            const changeEvent = new Event('change', {'bubbles': true});
            const testFile = getImageFileForTest();

            //force set files to HTMLInputElement (input type=file)
            setFilesToHTMLInputElement(inputEle, [testFile]);

            fileChoice.events().on('filedrop', (data) => {

                const target = data.target;
                const files = data.files;

                const file = files[0];

                expect(file.name).toBe(testFile.name);
                expect(file.type).toBe(testFile.type);
                expect(file.size).toBe(testFile.size);
                expect(target).toBe(fileChoice.getTargetUploadArea());

                done();
            });

            //send event
            inputEle.dispatchEvent(changeEvent);

        });
    });

    describe('doDrop()', () => {

        test('Check events', (done) => {

            createHTML4OneDropArea();

            const fileChoice = new FileChoice();

            const testFile = getImageFileForTest();
            const testFiles = [testFile, testFile, testFile];

            fileChoice.events().on('filedrop', (data) => {

                const target = data.target;
                const files = data.files;

                expect(files.length).toBe(testFiles.length);

                const file0 = files[0];

                expect(file0.name).toBe(testFile.name);
                expect(file0.type).toBe(testFile.type);
                expect(file0.size).toBe(testFile.size);

                const file1 = files[1];

                expect(file1.name).toBe(testFile.name);
                expect(file1.type).toBe(testFile.type);
                expect(file1.size).toBe(testFile.size);

                const file2 = files[2];

                expect(file2.name).toBe(testFile.name);
                expect(file2.type).toBe(testFile.type);
                expect(file2.size).toBe(testFile.size);

                expect(target).toBe(fileChoice.getTargetUploadArea());

                done();
            });

            fileChoice.doDrop(testFiles);
        });


    });


});
