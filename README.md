# aiflash
Serverless app utilizing generative AI to transform raw study notes into interactive flashcards. Built with an Angular frontend and a scalable AWS backend, it features 3D card animations and real time AI processing via OpenRouter.

This project was part of a challenge: https://montasirmoyen.com/blog/aiflash

**Basic Usage**
- Lambda function to generate flashcards is provided in ```/aws/lambda/```
- Configure the URL in ```/src/app/services/api.service.ts:10```