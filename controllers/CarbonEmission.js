const carbonemission = require("../services/CarbonEmission.js");;
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
exports.getAllCarboneEmission = async(req,res)=>{
    try {
        const allCarbon = await carbonemission.getAllCarbonEmission(req,res);
        return res.json(allCarbon);
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
    }
    exports.createformule = async (req, res) => {
        try {
          const newFormule = await carbonemission.createformule(req.body);
          res.json(newFormule);
        } catch (error) {
          console.error("Controller error:", error);
          res.status(500).json({ message: "Internal Server Error" });
        }
      };
      exports.generatePDF = async (req, res) => {
        const { date } = req.params;
      
        if (!date) {
          console.error('Date parameter is required');
          return res.status(400).send('Date parameter is required');
        }
      
        try {
          console.log(`Fetching emissions for date: ${date}`);
          const emissions = await carbonemission.getCarbonEmissionsByDate(date);
      
          if (!emissions || emissions.length === 0) {
            console.error('No emissions found for the given date');
            return res.status(404).send('No emissions found for the given date');
          }
      
          const doc = new PDFDocument({ margin: 30 });
          const filePath = path.join(__dirname, '..', 'output.pdf');
          console.log('PDF file path:', filePath);
  
          const writeStream = fs.createWriteStream(filePath);
          writeStream.on('finish', function () {
              console.log('PDF generation finished');
              res.download(filePath, 'carbon_emission_report.pdf', (err) => {
                  if (err) {
                      console.error('Error downloading file:', err);
                  } else {
                      fs.unlink(filePath, (err) => {
                          if (err) {
                              console.error('Error deleting file:', err);
                          }
                      });
                  }
              });
          });
  
          writeStream.on('error', function (err) {
              console.error('Stream error:', err);
              res.status(500).send('Error generating PDF: ' + err.message);
          });
  
          doc.pipe(writeStream);
  
          // Adding Company Logo
          doc.image('./workpoint.png', 50, 45, { width: 100 })
              .fontSize(40)
              
              .fontSize(10)
              .text('Ariana Soghra ', 200, 50, { align: 'right' })
              .text('City,3020', 200, 65, { align: 'right' })
              .text('Phone: (+216) 50910564', 200, 80, { align: 'right' })
              .moveDown();
  
          
          doc.fontSize(20).text('Carbon Emission Report', 200, 125)
              .fontSize(10)
              .moveDown();

          
  
          
          doc.fontSize(12)
              .moveDown();
  
          
          const tableTop = 250;
          const itemHeight = 30;
          doc.fontSize(12);
          doc.fillColor('#000000');
  
          doc.text('User', 50, tableTop, { width: 150, align: 'left' });
          doc.text('Date', 200, tableTop, { width: 100, align: 'left' });
          doc.text('Total Distance (km)', 300, tableTop, { width: 100, align: 'left' });
          doc.text('Total Duration (minute)', 400, tableTop, { width: 100, align: 'left' });
          doc.text('Carbon Emission (kg CO2eq)', 500, tableTop, { width: 100, align: 'left' });
          doc.text('Formule', 650, tableTop, { width: 100, align: 'left' });
  
          let position = tableTop + itemHeight;
          doc.moveDown(2);
  
          emissions.forEach(emission => {
            const userName = emission.user ? emission.user.fullName : 'N/A';
            const formuleName = emission.formule ? emission.formule.name : 'N/A';

            doc.text(userName, 50, position, { width: 150, align: 'left' });
            doc.text(new Date(emission.date).toLocaleDateString(), 200, position, { width: 100, align: 'left' });
            doc.text(emission.totalDistance.toFixed(2), 300, position, { width: 100, align: 'left' });
            doc.text(emission.totalDuration.toFixed(2), 400, position, { width: 100, align: 'left' });
            doc.text(emission.carbonEmission.toFixed(2), 500, position, { width: 150, align: 'left' });
           // doc.text(formuleName, 650, position, { width: 100, align: 'left' });

            position += itemHeight;
        });
        const pageHeight = doc.page.height;
        const imageHeight = 50; // Adjust the height as needed
        const bottomPosition = pageHeight - imageHeight -115;
        const bottom = pageHeight - imageHeight ; // 30 is the bottom margin
        doc.image('./signature.jfif', 50, bottomPosition, { width: 170 });
        doc.fontSize(10).text(`Sfax le : ${new Date().toLocaleDateString()}`, 95,bottom);
  
          doc.end();
      } catch (err) {
          console.error('Error generating PDF:', err);
          res.status(500).send('Error generating PDF: ' + err.message);
      }
  };
      exports.getCarbonEmissionsByDate = async (req, res) => {
        try {
          const { date } = req.params;
          const emissions = await carbonemission.getCarbonEmissionsByDate(date);
      
          if (!emissions || emissions.length === 0) {
            return res.status(404).json({ message: 'No emissions found for this date' });
          }
      
          res.status(200).json(emissions);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }