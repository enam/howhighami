<?php
	$suffix = $_POST['sfx'];
	$prefix = '';//http://128.223.137.200:8080/thredds/wms/analogue/';
	readfile($prefix.$suffix);
?>