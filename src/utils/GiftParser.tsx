interface GiftQuestion {
    text: string;
    options: string[];
    correctAnswer: number;
    feedback?: string;
  }
  
  export function parseGiftFormat(giftText: string): GiftQuestion[] {
    const questions: GiftQuestion[] = [];
    const questionBlocks = giftText.split('\n\n').filter(block => block.trim());
  
    for (const block of questionBlocks) {
      try {
        const lines = block.split('\n').map(line => line.trim());
        const questionText = lines[0].replace(/^\{.*?\}/, '').trim();
        const optionsStart = lines.findIndex(line => line.startsWith('{'));
        
        if (optionsStart === -1) continue;
  
        const optionsText = lines[optionsStart];
        const options: string[] = [];
        let correctAnswer = 0;
  
        const optionMatches = optionsText.match(/\{([^}]+)\}/);
        if (!optionMatches) continue;
  
        const optionsList = optionMatches[1].split('~');
        optionsList.forEach((option, index) => {
          if (option.startsWith('=')) {
            correctAnswer = index;
            options.push(option.substring(1).trim());
          } else {
            options.push(option.trim());
          }
        });
  
        // Extract feedback if present
        const feedbackMatch = block.match(/####([^#]+)####/);
        const feedback = feedbackMatch ? feedbackMatch[1].trim() : undefined;
  
        questions.push({
          text: questionText,
          options,
          correctAnswer,
          feedback
        });
      } catch (error) {
        console.error('Error parsing GIFT question:', error);
      }
    }
  
    return questions;
  }
  
  export function convertToGiftFormat(questions: GiftQuestion[]): string {
    return questions.map(question => {
      const options = question.options.map((option, index) => 
        index === question.correctAnswer ? `=${option}` : option
      ).join('~');
  
      const feedbackSection = question.feedback ? `\n####${question.feedback}####` : '';
      
      return `${question.text}\n{${options}}${feedbackSection}\n`;
    }).join('\n');
  }