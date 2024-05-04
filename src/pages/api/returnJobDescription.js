const generateDescription = async ({
  jobTitle,
  industry,
  keyWords,
  tone,
  numWords,
}) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a hiring manager for a company that is looking to hire a new employee. You need to write a job description for a job posting. The job description should be SEO friendly and should highlight the unique features and benefits of the job position.",
          },
          {
            role: "user",
            content: `Write a job description for a  ${jobTitle} role ${
              industry ? `in the ${industry} industry` : ""
            } that is around ${numWords || 200} words in a ${
              tone || "neutral"
            } tone. ${
              keyWords ? `Incorporate the following keywords: ${keyWords}.` : ""
            }.`,
          },
        ],
        max_tokens: 300,
        temperature: 0.5,
      }),
    });
    const data = await response.json();

    return data.choices[0].message.content;
  } catch (err) {
    console.error(err);
  }
};

export default async function handler(req, res) {
  const { jobTitle, industry, keyWords, tone, numWords } = req.body;

  const jobDescription = await generateDescription({
    jobTitle,
    industry,
    keyWords,
    tone,
    numWords,
  });

  res.status(200).json({
    jobDescription,
  });
}
