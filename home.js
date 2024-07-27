module.exports = (title, status) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <title>Todo Details</title>
</head>
<body>
  <h1>Todo Details</h1>
  <table>
    <tr>
      <th>Title</th>
      <th>Status</th>
    </tr>
    <tr>
      <td>${title}</td>
      <td>${status}</td>
    </tr>
  </table>
  
</body>
</html>
`;
