<?php
/**
 * Search Engine Optimization 플러그인 
 *
 * @package net.lovelyus.g5.plugin.seo
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 */
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

$luSeo = new LUSeo();
$luSeo->hook($gp_scope);

/**
 * 
 * 
 * @author Chongmyung Park <byfun@byfun.com> 
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 */
class LUSeo
{
  var $id;
  var $scope;

	var $title = "";
	var $subject = "";
	var $publisher = "";
	var $description = "";
	var $keywords = "";

  /**
   * hook : gpf 후킹
   * 
   * @access public
   * @return void
   */
	function hook($gp_scope)
	{ 
		$this->scope = $gp_scope;
		$this->id = gp_plugin_id(__FILE__);
    gp_add_action('load', array($this, 'on_load'));
    gp_add_action('unload', array($this, 'on_unload'));
	}

	function on_load()
	{
    global $bo_table, $wr_id;
		if(!$bo_table || !$wr_id) return;
		ob_start();
	}

	function on_unload()
	{
    global $bo_table, $wr_id, $view, $board, $group;

		if(!$bo_table || !$wr_id) return;
		
		$out = ob_get_contents();
		ob_end_clean();
		
		$write_title = conv_subject(strip_tags($view['wr_subject']), 64) . ' < '. $board['bo_subject'] . ' < ' . $group['gr_subject'];
		$out = preg_replace("/<title>(.*?)<\/title>/", '<title>'.htmlspecialchars($write_title).'</title>', $out);

    $this->subject = gp_do_filter('seo_subject', $this->subject);
    $this->title = gp_do_filter('seo_title', $this->title);
    $this->description = gp_do_filter('seo_description', $this->description);
    $this->publisher = gp_do_filter('seo_publisher', $this->publisher);
    $this->keywords = gp_do_filter('seo_keywords', $this->keywords);
		
		$subject = ($this->subject != "" ? $this->subject : $view['wr_subject']);
		$title = ($this->title != "" ? $this->title : $view['wr_subject']);
		$description = ($this->description != "" ? $this->description : strip_tags(conv_subject("$group[gr_subject] - $board[bo_subject] - $view[wr_subject]", 255)) );
		$publisher = ($this->publisher != "" ? $this->publisher : $_SERVER['SERVER_NAME']);		
		$keywords = $this->keywords;

		preg_match_all("/(?<!\w)#([a-zA-Z가-힣0-9]+)/", $view['wr_content'], $matched);
		$keys = array();
		
		while (!empty($matched[1])) {
			$val = array_pop($matched[1]);
			if (array_search($val, $keys) === FALSE)
			{
				array_push($keys, $val);
			}
		}

		$keywords = ($keywords == "" ? "" : ", ") . implode(", ", $keys);

		$head_tag = '<title>';
		$pos_head = strpos($out, $head_tag);
		$before = substr($out, 0, $pos_head);
		$after = substr($out, $pos_head, strlen($out));
		if($pos_head === FALSE) {
			//echo $out;
			//return;
		}
		echo $before;
		?>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="subject" content="<?=htmlspecialchars($subject)?>" />
<meta name="title" content="<?=htmlspecialchars($title)?>" />
<meta name="publisher" content="<?=htmlspecialchars($publisher)?>" />
<meta name="keywords" content="<?=htmlspecialchars($keywords)?>" />
<meta name="description" content="<?=htmlspecialchars($description)?>" />
<meta name="robots" content="index,follow" />
<link rel="canonical" href="<?$_SERVER['PHP_SELF']?>?bo_table=<?=$bo_table?>&wr_id=<?=$wr_id?>" />
<?	
		echo $after;

		//echo "<textarea style='width:100%;height:200px'>";
		//echo htmlspecialchars($out);
		//echo "</textarea>";
	}
}
?>
