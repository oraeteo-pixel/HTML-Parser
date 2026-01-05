<?php

/**
 * GPF 플러그인/코어 업데이트 실행 스크립트
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
include_once '_common.php';

$g5['title'] = '업데이트';

if (!$utarget)
    alert('잘못된 연결');

$page_ids = array('gpf' => 'gpf_upgrade', 'plugin' => 'plugins', 'uploadPlugin' => 'plugins', 'skin' => 'skins', 'uploadSkin' => 'skins');
$gpa_page_id = $page_ids[$utarget];

$upgrader_file = GP_ADMIN_PATH . '/lib/class.upgrader.' . $utarget . '.php';
$upgrader_class = ucfirst($utarget) . 'Upgrader';
if (!file_exists($upgrader_file))
    alert('존재하지 않는 업그레이더입니다.');

include_once $upgrader_file;

if (!class_exists($upgrader_class))
    alert('업그레이더 클래스가 존재하지 않습니다.');

$upgrader = new $upgrader_class();
include_once GP_ADMIN_PATH . '/head.php';
$upgrader->setNoOBHeader();

$upgrader->doit($md);

include_once GP_ADMIN_PATH . '/tail.php';
?>
