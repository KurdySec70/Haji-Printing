<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Settings
    |--------------------------------------------------------------------------
    |
    | Set some default values. It is possible to add all defines that can be set
    | in dompdf_config.inc.php. You can also override the entire config file.
    |
    */
    'show_warnings' => false,   // Throw an Exception on warnings from dompdf
    'orientation' => 'portrait',
    'defines' => [
        /**
         * The location of the DOMPDF font directory
         *
         * The location of the directory where DOMPDF will store fonts and font metrics
         * Note: This directory must exist and be writable by the webserver process.
         * *Please note the trailing slash.*
         *
         * Notes regarding fonts:
         * Additional .afm font metrics can be added by executing load_font.php from command line.
         *
         * Only the original "Base 14 fonts" are present on all pdf viewers. Additional fonts must
         * be embedded in the pdf file or the PDF may not display correctly. This can significantly
         * increase file size unless font subsetting is enabled. Before embedding a font please
         * review your rights under the font's license.
         *
         * Any font specification in the source HTML is translated to the closest font available
         * in the font directory.
         *
         * The pdf standard "Base 14 fonts" are:
         * Courier, Courier-Bold, Courier-BoldOblique, Courier-Oblique,
         * Helvetica, Helvetica-Bold, Helvetica-BoldOblique, Helvetica-Oblique,
         * Times-Roman, Times-Bold, Times-BoldItalic, Times-Italic,
         * Symbol, ZapfDingbats.
         */
        "font_dir" => storage_path('fonts/'), // advised by dompdf (https://github.com/dompdf/dompdf/pull/782)

        /**
         * The location of the DOMPDF font cache directory
         *
         * This directory contains the cached font metrics for the fonts used by DOMPDF.
         * This directory can be the same as DOMPDF_FONT_DIR
         *
         * Note: This directory must exist and be writable by the webserver process.
         */
        "font_cache" => storage_path('fonts/'),

        /**
         * The location of a temporary directory.
         *
         * The directory specified must be writeable by the webserver process.
         * The temporary directory is required to download remote images and when
         * using the PFDLib back end.
         */
        "temp_dir" => sys_get_temp_dir(),

        /**
         * ==== IMPORTANT ====
         *
         * dompdf's "chroot": Prevents dompdf from accessing system files or other
         * files on the webserver.  All local files opened by dompdf must be in a
         * subdirectory of this directory.  DO NOT set it to '/' since this could
         * allow an attacker to use dompdf to read any file on the server.  This
         * should be an absolute path.
         * This is only checked on command line call by dompdf.php, but not by
         * direct class use like:
         * $dompdf = new DOMPDF();	$dompdf->load_html($html); $dompdf->render(); $pdf = $dompdf->output();
         */
        "chroot" => realpath(base_path()),

        /**
         * Whether to enable font subsetting or not.
         */
        "enable_font_subsetting" => false,

        /**
         * The PDF rendering backend to use
         *
         * Valid settings are 'PDFLib', 'CPDF' (the bundled R&OS CPDF class), 'GD' and
         * 'auto'. 'auto' will look for PDFLib and use it if found, or if not it will
         * fall back on CPDF. 'GD' renders PDFs to graphic files. {@link Canvas_Factory}
         * ultimately determines which rendering class to instantiate based on this
         * setting.
         *
         * Both PDFLib & CPDF rendering backends provide sufficient rendering
         * capabilities for dompdf, however additional features (e.g. object,
         * image and font support, etc.) differ between backends.  Please see
         * {@link PDFLib_Adapter} for more information on the PDFLib backend
         * and {@link CPDF_Adapter} and R&OS CPDF documentation for more
         * information on CPDF. Also see the documentation for each backend at the
         * following URLs:
         *
         * http://www.pdflib.com/en/download/pdflib-family/pdflib/
         * http://www.ros.co.nz/pdf
         * http://www.php.net/image
         *
         * Note: CPDF is bundled with this package and does not require any external
         * libraries.
         */
        "pdf_backend" => "CPDF",

        /**
         * PDFlib license key
         *
         * If you are using the commercial PDFlib backend you must provide your
         * license key here.
         */
        //"pdllib_license" => "your license key here",

        /**
         * html target media view which should be rendered into pdf.
         * List of types and parsing rules for future extensions:
         * http://www.w3.org/TR/REC-html40/types.html
         *   screen, tty, tv, projection, handheld, print, braille, aural, all
         * Note: aural is deprecated in CSS 2.1 because it is replaced by speech in CSS 3.
         * Note, even though the generated pdf file is intended for print output,
         * the desired content might be different (e.g. screen or projection view of html file).
         * Therefore allow specification of content here.
         */
        "default_media_type" => "print",

        /**
         * The default paper size.
         *
         * North America standard is "letter"; other countries generally "a4"
         *
         * @see CPDF_Adapter::PAPER_SIZES for valid sizes ('letter', 'legal', 'A4', etc.)
         */
        "default_paper_size" => "A4",

        /**
         * The default paper orientation.
         *
         * The orientation of pages when no CSS @page rule is found
         */
        "default_paper_orientation" => "portrait",

        /**
         * The default font family
         *
         * Used if no suitable fonts can be found. This must exist in the font folder.
         * @var string
         */
        "default_font" => "Arial",

        /**
         * Image DPI setting
         *
         * This setting determines the default DPI setting for images and fonts.  The
         * DPI may be overridden for inline images by explictly setting the
         * image's width and height style attributes (i.e. if the image's native
         * width is 600 pixels and you specify the image's width as 72 points,
         * the image will have a DPI of 600 in the rendered PDF.  The DPI of
         * background images may not be overridden and is controlled entirely
         * via this parameter.
         *
         * For the purposes of DOMPDF, pixels per inch (PPI) = dots per inch (DPI).
         * If a size in html is given as px (or without unit as image size),
         * this tells the corresponding size in pt.
         * This adjusts the relative sizes to be similar to the rendering of the
         * html page in a reference browser.
         *
         * In pdf, always 1 pt = 1/72 inch
         *
         * Rendering resolution of various browsers in px per inch:
         * Windows Firefox and Internet Explorer:
         *   SystemDPI (Screen width / width in pixel)*72 px/in
         *   (normally 96 px/in)
         * macOS Firefox:
         *   Uses "User fixed" DPI per display / switchable in advanced settings
         *   (normallyalso 96 px/in)
         * macOS Safari:
         *   Uses internal DPI, ca. 72 px/in, elsewhise window and zoom dependent;
         *   Since ios 10.3 scaling and zoom is properly supported
         * Linux Firefox:
         *   Uses system settings (often 96 px/in)
         * Android Firefox and Chrome:
         *   Device and zoom dependent, normally ranging from 90 to 160 px/in
         *
         * Note: This setting is not supported in the Imagick windows version
         */
        "dpi" => 150,

        /**
         * Enable inline PHP
         *
         * If this setting is set to true then DOMPDF will automatically evaluate
         * inline PHP contained within <script type="text/php"> ... </script> tags.
         *
         * Enabling this for documents you do not trust (e.g. arbitrary remote html
         * pages) is a security risk.  Set this option to false if you wish to process
         * untrusted documents.
         */
        "enable_php" => true,

        /**
         * Enable inline Javascript
         *
         * If this setting is set to true then DOMPDF will automatically insert
         * JavaScript code contained within <script type="text/javascript"> ... </script> tags.
         * Enabling this for documents you do not trust (e.g. arbitrary remote html
         * pages) is a security risk.  Set this option to false if you wish to process
         * untrusted documents.
         */
        "enable_javascript" => false,

        /**
         * Enable remote file access
         *
         * This setting determines whether DOMPDF can access remote resources (i.e.
         * stylesheets or images via http/ftp).
         *
         * Enabling this for documents you do not trust (e.g. arbitrary remote html
         * pages) is a security risk, if combined with DOMPDF_ENABLE_PHP.  Set this
         * option to false if you wish to process untrusted documents.
         */
        "enable_remote" => true,

        /**
         * A ratio applied to the fonts height to be more like browsers' line height
         */
        "font_height_ratio" => 1.1,

        /**
         * Use the HTML5 Lib parser
         *
         * Enabling this for documents you do not trust (e.g. arbitrary remote html
         * pages) is a security risk, if combined with DOMPDF_ENABLE_PHP.  Set this
         * option to false if you wish to process untrusted documents.
         */
        "enable_html5_parser" => true,
    ],
];