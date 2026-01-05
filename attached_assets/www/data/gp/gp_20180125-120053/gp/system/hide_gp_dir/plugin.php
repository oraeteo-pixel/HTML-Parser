<?
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

if(basename($_SERVER['SCRIPT_NAME']) == 'config_form.php')
{
    gp_add_action('head_script', 'gp_hide_gp_dir');
}

function gp_hide_gp_dir() 
{
    ?>
  <script type="text/javascript">
  $(document).ready(function() {
      $('option[value=".gp"]').remove();
  });
  </script>
  <?
}

?>
