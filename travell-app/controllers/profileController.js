exports.getProfile = (req, res) => {
  const username = req.username;
  if(username === "administrator") {
    res.json({ username, message: `Xin chào ${username}, \n Flag{The_First_Flag_Heree}`});
  } else {
    res.json({ username, message: `Xin chào ${username}` });
  }
};
