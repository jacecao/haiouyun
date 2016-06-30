<?php
	header('Content-Type:text/html;charset=utf-8');

	define('DB_HOST','localhost');
	define('DB_USER','root');
	define('DB_PWD','seagull');
	define('DB_NAME','blog');
	$con = mysqli_connect("localhost","root","seagull");
	if (!$con)
	  {
	  die('Could not connect: ' . mysql_error());
	  }
	mysqli_select_db($con,'blog'); 
	$query = "INSERT INTO blog_blog(title,content,date)
					VALUES('{$_POST['blog_title']}','{$_POST['blog_content']}',NOW())";
	
	mysqli_query($con,"set names 'utf8'");
	mysqli_query($con,$query) or die('新增出错'.mysql.error());
	
	sleep(3); //模拟网络延迟
	echo mysqli_affected_rows( $con );
	
	mysqli_close($con);


?>