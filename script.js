document.getElementById('processFilesBtn').addEventListener('click', function() {
    const files = document.getElementById('file-input').files;
    const fileAreas = document.getElementById('file-areas');
    const globalContactName = document.getElementById('globalContactNameInput').value.trim();

    fileAreas.innerHTML = ''; // Kosongkan div sebelum menambahkan textarea baru

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const textArea = document.createElement('textarea');
            textArea.classList.add('small-textarea');
            textArea.value = e.target.result;

            const fileNameInput = document.createElement('input');
            fileNameInput.type = 'text';
            fileNameInput.placeholder = 'Masukkan nama file VCF';
            fileNameInput.classList.add('file-name-input');

            const fileNameLabel = document.createElement('label');
            fileNameLabel.textContent = `Nama File Asal: ${file.name}`;
            fileNameLabel.classList.add('file-name-label');

            const generateButton = document.createElement('button');
            generateButton.textContent = 'Generate VCF';
            generateButton.classList.add('generate-vcf-btn');
            generateButton.addEventListener('click', () => {
                const lines = textArea.value.split('\n').map(line => line.trim());
                const filename = fileNameInput.value.trim() || file.name.replace(/\.[^/.]+$/, ''); // Gunakan nama file asal jika tidak ada input
                const contactName = globalContactName || file.name.replace(/\.[^/.]+$/, ''); // Gunakan nama file asal jika nama kontak global kosong

                let vcfContent = '';
                let contactIndex = 1;

                lines.forEach(line => {
                    if (line) {
                        let phoneNumber = line;
                        if (!phoneNumber.startsWith('+')) {
                            phoneNumber = '+' + phoneNumber;
                        }
                        vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName} ${contactIndex}\nTEL:${phoneNumber}\nEND:VCARD\n\n`;
                        contactIndex++;
                    }
                });

                if (vcfContent) {
                    const blob = new Blob([vcfContent], { type: 'text/vcard' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${filename}.vcf`; // Nama file output
                    a.textContent = `Download ${filename}.vcf`;
                    a.style.display = 'block';
                    a.click();
                    URL.revokeObjectURL(url);
                }
            });

            fileAreas.appendChild(fileNameLabel);
            fileAreas.appendChild(fileNameInput);
            fileAreas.appendChild(textArea);
            fileAreas.appendChild(generateButton);
        };
        reader.readAsText(file);
    });
});
