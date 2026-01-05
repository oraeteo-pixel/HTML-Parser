<?php
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가

function gp_html_process_load()
{
    ob_start();
}

function gp_html_process_unload()
{
    $html_content = ob_get_contents();
    ob_end_clean();
    echo gp_do_filter('html', $html_content);
}

gp_add_action('load', 'gp_html_process_load');
gp_add_action('unload', 'gp_html_process_unload');
?>