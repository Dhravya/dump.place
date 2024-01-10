bytestring = """b'2024GameManual.pdf':b'$pdf$5*6*256*-1028*1*16*ce53a9c0bfbfa34a9d0e425fc12b33ab*127*4592bd5cf7d97cd575d2ccf34fc9aad2f84cf37c403b38dff10763b26c919bd9da83db3d9bc04288eef608368a4c32b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000*127*e190db2ab98f20739c73b24070c0ffa3e55b9f19de791a28b00a9ce404c5347deb2c248d27567337850b38c080bb0f4a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000*32*54f9b813374d67586ddc09515dac369d038b59a49153cd7184772ff60ff9e1a1*32*09f583f2aa483ba3f41f160f6acdd5d06c1bcd2047259f18f511b28ff22edebe':::::b'2024GameManual.pdf'"""

# bytestring is in csv format, so we can use the csv module to parse it

import csv
from io import StringIO

# create a file-like object from the string
f = StringIO(bytestring)

# use the csv module to parse it
reader = csv.reader(f, delimiter=':', quoting=csv.QUOTE_NONE)

# iterate over the rows
for row in reader:
    # row is a list of strings
    print(row)


# Save csv to file
import csv
from io import StringIO

# create a file-like object from the string
f = StringIO(bytestring)

# use the csv module to parse it
reader = csv.reader(f, delimiter=':', quoting=csv.QUOTE_NONE)

# iterate over the rows
with open('output.csv', 'w') as csvfile:
    writer = csv.writer(csvfile)
    for row in reader:
        # row is a list of strings
        writer.writerow(row)