// lib/fonts.js
import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = vfsFonts.pdfMake.vfs;

export default pdfMake;