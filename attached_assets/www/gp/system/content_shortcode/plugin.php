<?php
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가

// bbs/content.php 를 호출 했을 경우에만
// gb.content 컨텍스트의 숏코드 실행
//
// content.php 의 skin_path 는 intercept 할 수 없기 때문에
// 전체 출력되는 HTML 을 캡쳐해서 숏코드 적용
if(basename($_SERVER['SCRIPT_NAME']) == 'content.php' &&
    strpos(realpath(dirname($_SERVER['SCRIPT_FILENAME'])), realpath(G5_BBS_PATH)) === 0) {

    function gp_scd_unload($html_content)
    {
        return gp_do_shortcode('gb.content', $html_content);
    }

    gp_add_filter('html', 'gp_scd_unload');
}

// 게시판 뷰 페이지에 대한 숏코드 실행
function gp_scd_board_view()
{
    $GLOBALS['view']['content'] = gp_do_shortcode('gb.board.view', $GLOBALS['view']['content']);
}
gp_add_action('pre_view', 'gp_scd_board_view');
?>