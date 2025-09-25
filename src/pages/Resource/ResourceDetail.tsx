import React from "react";

const NewsArticle: React.FC = () => {
  const htmlContent = `
    <h1>Learn English: Improve Your Skills</h1>
    <div>
      <p>
        Learning English can open doors to numerous opportunities, both personally and professionally. In this
        article, we’ll explore tips and techniques to improve your English proficiency.
      </p>
      <h2>Vocabulary Building</h2>
      <p>
        Expanding your vocabulary is essential for speaking and writing fluently. You can start by learning 5 new words
        every day and using them in sentences to reinforce your memory.
      </p>
      <h2>Listening Practice</h2>
      <p>
        Listening to English podcasts, audiobooks, or watching English TV shows and movies will improve your listening
        skills and expose you to different accents and speech patterns.
      </p>
      <h2>Speaking Exercises</h2>
      <p>
        Regularly practicing speaking is crucial. You can do this by finding a language partner or using language apps to
        practice speaking and get feedback on your pronunciation.
      </p>
      <h2>Writing Tips</h2>
      <p>
        Writing regularly in English will improve your grammar and sentence structure. Start by writing short essays or
        daily journals.
      </p>
    </div>
    <footer>
      <p>Article by English Learning Hub | 23/03/2025</p>
    </footer>
  `;

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
      {/* Áp dụng class CSS cho nội dung */}
      <div className="article-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default NewsArticle;
