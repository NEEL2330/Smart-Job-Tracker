const MatchResult = ({ result }) => {
  return (
    <div className="match-result">
      <h3>Match Score: {result.match_score}%</h3>

      <h4>Strong Skills</h4>
      <ul>
        {result.strong_skills.map((skill, i) => (
          <li key={i} style={{ color: "green" }}>{skill}</li>
        ))}
      </ul>

      <h4>Missing Skills</h4>
      <ul>
        {result.missing_skills.map((skill, i) => (
          <li key={i} style={{ color: "red" }}>{skill}</li>
        ))}
      </ul>

      <h4>Suggestions</h4>
      <ul>
        {result.suggestions.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
};

export default MatchResult;
