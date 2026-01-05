<?php
/**
 *
 * GPF 코어 업그레이드 내역
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
include_once '_common.php';
include_once GP_ADMIN_PATH . DS . 'head.php';
echo '<h1>업그레이드 내역</h1>';
echo '<pre>';
echo get_text(file_get_contents(GP_ADMIN_PATH . DS . 'history.txt'));
echo '</pre>';
include_once GP_ADMIN_PATH . DS . 'tail.php';
?>
