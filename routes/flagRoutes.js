const express = require("express");
const path = require("path");

const router = express.Router();

const expectedFlags = {
  1: "Flag{The_First_Flag_Heree}",
  2: "Flag{Th3_S3c0nd_Fl4g_P4th_Tr4v3rs4l}",
  3: "Flag{F1n4l_SQL1_M4st3r_7A9C}",
};

router.get("/flag", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "flag.html"));
});

router.post("/flag/submit", (req, res) => {
  const { flagIndex, flagInput } = req.body || {};
  const expected = expectedFlags[String(flagIndex)];
  const valid = expected && String(flagInput || "").trim() === expected;

  const message = valid
    ? `Congratulations! Flag ${flagIndex} đúng.`
    : `Flag ${flagIndex} không đúng. Vui lòng thử lại.`;

  res.json({
    success: Boolean(valid),
    message,
    flagIndex,
  });
});

module.exports = router;
