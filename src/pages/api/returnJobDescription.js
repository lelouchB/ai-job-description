const generateDescription = async ({
  jobTitle,
  industry,
  keyWords,
  tone,
  numWords,
}) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: `Write a job description for a  ${jobTitle} role 
          ${industry ? `in the ${industry} industry` : ""} that is around ${
            numWords || 200
          } words in a ${tone || "neutral"} tone. ${
            keyWords ? `Incorporate the following keywords: ${keyWords}.` : ""
          }. The job position should be described in a way that is SEO friendly, highlighting its unique features and benefits.`,
          max_tokens: 300,
          temperature: 0.5,
        }),
      }
    );
    const data = await response.json();

    return data.choices[0].text;
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
