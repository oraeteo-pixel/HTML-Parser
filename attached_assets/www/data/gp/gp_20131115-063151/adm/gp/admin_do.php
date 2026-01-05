<?php
/**
 *
 *  관리 플러그인 독립 실행 페이지
 *
 * 플러그인에서 pxa_<액션명> 으로 action 을 추가하고,
 * 이 페이지를 admin_do.php?id=<PLUGIN_ID>&act=<ACTION_NAME>으로 호출하면
 * 플러그인의 독립적인 페이지 실행을 구현할 수 있습니다.
 *
 * 이때, layout=1 파라미터를 같이 넘기면, 
 * GPF 관리 디렉토리의 head.php, tail.php 가 include 됩니다.
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
include_once "_common.php";

$g5['title'] = 'Admin Action';

if (!$id || !$act) gp_alert('DO : 잘못된 접근');

$sla_page_id = 'plugins';

if ($layout) include_once GP_ADMIN_PATH . '/head.php';

$gp_act = 'pxa_' . $act;

if (!gp_has_action($gp_act)) {
    gp_alert('DO : 요청 처리 루틴이 존재하지 않습니다.');
}

gp_do_action($gp_act);

if ($layout) include_once GP_ADMIN_PATH . '/tail.php';
?>
