<?php

/**
 * 플러그인 비활성화 스크립트
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
define("NO_GP_PLUGINS", TRUE);

include_once "_common.php";

if (!$id)
    gp_alert('잘못된 접근');

include_once "inc.the.plugin.php";

gp_do_action('gpa_pre_deactivate_plugin_' . $id);

$res = gp_deactivate_plugin($id, $gp_scope);
if (!$res)
    alert('플러그인 비활성화에 실패했습니다.', 'plugins.php' . gp_uparam());

gp_do_action('gpa_post_deactivate_plugin_' . $id);

goto_url('plugins.php' . gp_uparam());
?>
