const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const testPDFGeneration = async () => {
    try {
        const doc = new PDFDocument();
        const filePath = path.join(__dirname, 'test_output.pdf');
        console.log('PDF file path:', filePath);

        const writeStream = fs.createWriteStream(filePath);
        writeStream.on('finish', function () {
            console.log('PDF generation finished');
        });

        writeStream.on('error', function (err) {
            console.error('Stream error:', err);
        });

        doc.pipe(writeStream);

        doc.fontSize(16).text('Test Carbon Emission Report', { align: 'center' });
        doc.moveDown();

        // Add some test data
        doc.fontSize(12).text(`User: Test User`);
        doc.text(`Date: 2024-01-01`);
        doc.text(`Total Distance: 100 km`);
        doc.text(`Total Duration: 2 hours`);
        doc.text(`Carbon Emission: 50 kg CO2eq`);
        doc.text(`Formule: Test Formule`);
        doc.moveDown();

        doc.end();
    } catch (err) {
        console.error('Error generating PDF:', err);
    }
};

testPDFGeneration();
