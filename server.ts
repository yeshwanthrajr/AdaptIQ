import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // AI Endpoint: Decompose and Personalize Faculty Notes into Priority Units, Visual Models, and Practice Assessments
  app.post('/api/ai/personalize-notes', async (req, res) => {
    try {
      const { notesText, subject, unit, unitName, targetStudentCohort } = req.body;

      if (!notesText || typeof notesText !== 'string') {
        return res.status(400).json({ error: 'notesText is required' });
      }

      const client = getAiClient();

      if (client) {
        const prompt = `You are an expert engineering curriculum designer and cognitive learning AI for university computer science students.
The faculty uploaded the following lecture notes/materials for "${subject || 'Deep Learning & Neural Systems'}", ${unit || 'Unit 2'} ("${unitName || 'Backpropagation & Computational Graphs'}"):

--- LECTURE NOTES CONTENT ---
${notesText.substring(0, 8000)}
--- END NOTES ---

Student Cohort Profile:
- Target Mastery Index: ${targetStudentCohort?.masteryIndex || 84}%
- Bloom Taxonomy Tier: ${targetStudentCohort?.bloomTier || 'L4 • Synthesis'}
- Learning Preference: Visual diagrams, interactive simulations, and mathematical derivations.

Analyze this material and return ONLY a valid JSON object (no markdown code blocks, just raw JSON) matching this exact schema:
{
  "summary": "Concise 2-3 sentence overview of this unit",
  "priorityConcepts": [
    {
      "name": "Concept name",
      "priority": "HIGH" | "MEDIUM" | "CRITICAL_EXAM",
      "importanceReason": "Why this concept is crucial for engineering exams and labs",
      "bloomLevel": "L2" | "L3" | "L4",
      "estimatedMinutes": 30
    }
  ],
  "visualMentalModels": [
    {
      "concept": "Concept name",
      "visualType": "Computation Graph / Architecture Flow" | "Mathematical Step Decomposition" | "Real-World Industrial Analogy",
      "headline": "Short punchy intuition",
      "representation": "Detailed ASCII/text flow diagram or LaTeX-like step-by-step mathematical breakdown showing exactly how the signals/tensors propagate",
      "analogy": "A relatable real-world physical analogy to cement deep conceptual understanding",
      "commonPitfall": "The single most common mistake students make in lab or exam"
    }
  ],
  "adaptiveAdjustments": {
    "forStrugglingStudents": "Specific prerequisite bridge and simplified mental model",
    "forAdvancedStudents": "Advanced vectorization or GPU kernel optimization challenge",
    "examTip": "High-yield advice for university semester examinations"
  },
  "practiceAssessment": [
    {
      "id": "q1",
      "question": "Rigorous engineering question testing understanding of these notes",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed step-by-step breakdown of why this option is correct and others are wrong",
      "bloomLevel": "L3 • Application"
    },
    {
      "id": "q2",
      "question": "Conceptual or numerical calculation question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 1,
      "explanation": "Mathematical justification and edge-case explanation",
      "bloomLevel": "L4 • Synthesis"
    },
    {
      "id": "q3",
      "question": "Practical implementation or debugging scenario",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 2,
      "explanation": "Engineering troubleshooting rationale",
      "bloomLevel": "L4 • Synthesis"
    }
  ]
}`;

        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '{}';
        const parsed = JSON.parse(rawText);
        return res.json({ success: true, data: parsed, source: 'gemini-3.8-flash' });
      }

      // Fallback high-yield academic personalization if GEMINI_API_KEY is not configured
      const fallbackResult = {
        summary: `Structured academic breakdown for ${unit || 'Unit 2'}: ${unitName || 'Computation Graphs & Automatic Differentiation'}. Decomposed for cognitive mastery and university semester exam alignment.`,
        priorityConcepts: [
          {
            name: 'Multivariate Chain Rule & Topological Sort',
            priority: 'CRITICAL_EXAM',
            importanceReason: 'Foundational for computing exact partial derivatives in deep directed acyclic graphs (DAGs).',
            bloomLevel: 'L4',
            estimatedMinutes: 45,
          },
          {
            name: 'Jacobian-Vector Products (JVPs) vs Vector-Jacobian Products (VJPs)',
            priority: 'HIGH',
            importanceReason: 'Explains why reverse-mode automatic differentiation is O(1) in scalar loss vs O(N) in forward mode.',
            bloomLevel: 'L4',
            estimatedMinutes: 40,
          },
          {
            name: 'Vanishing & Exploding Gradients in Deep Architectures',
            priority: 'MEDIUM',
            importanceReason: 'Crucial for numerical stability, Xavier/He initialization, and residual skip connections.',
            bloomLevel: 'L3',
            estimatedMinutes: 30,
          },
        ],
        visualMentalModels: [
          {
            concept: 'Reverse-Mode Automatic Differentiation Graph',
            visualType: 'Computation Graph / Architecture Flow',
            headline: 'Signals flow forward to compute loss; gradients flow backward along transposed paths.',
            representation: `[ Input Tensor x ] ────> ( W · x + b ) ────> [ z ] ────> ( ReLU / Sigmoid ) ────> [ a ] ────> ( Loss L )
        │                                                                                     │
        ▲ <─── VJP: ∂L/∂x = W^T · (∂L/∂z) <─── [ ∂L/∂z = ∂L/∂a ⊙ σ'(z) ] <─── ∂L/∂a <───────┘`,
            analogy: 'Think of an industrial manufacturing assembly line with quality inspectors: the forward pass builds the car, and the backward pass traces back from the final defect to precisely calculate how much each component machine contributed to the error.',
            commonPitfall: 'Confusing matrix transposition order when backpropagating through linear layer weight multiplications: ∂L/∂W = (∂L/∂z) · x^T, not x^T · (∂L/∂z).',
          },
          {
            concept: 'Softmax Cross-Entropy Numerical Stabilization',
            visualType: 'Mathematical Step Decomposition',
            headline: 'Log-Sum-Exp trick prevents IEEE 754 floating-point overflow.',
            representation: `Standard:  p_i = exp(z_i) / Σ exp(z_j)          ──> exp(1000) causes float overflow!
Stabilized: p_i = exp(z_i - max(z)) / Σ exp(z_j - max(z))  ──> Largest exp term is exp(0) = 1.0`,
            analogy: 'Measuring elevation relative to the highest mountain peak rather than sea level, preventing your measuring tape from breaking.',
            commonPitfall: 'Computing softmax first and then taking logarithm, causing log(0) = -Inf errors. Always use log_softmax directly.',
          },
        ],
        adaptiveAdjustments: {
          forStrugglingStudents: 'Start with single-neuron scalar chain rule before expanding into tensor contractions and batch dimensions.',
          forAdvancedStudents: 'Implement fused CUDA kernels with shared SRAM memory to eliminate high-bandwidth memory (HBM) round-trips.',
          examTip: 'In Part B 16-mark questions, always draw the complete computation graph with intermediate nodes labeled before writing mathematical equations.',
        },
        practiceAssessment: [
          {
            id: 'q1',
            question: 'In a deep neural network with scalar loss L and input vector x ∈ ℝ^D, why is reverse-mode AD preferred over forward-mode AD for training?',
            options: [
              'Because forward-mode AD cannot compute second-order derivatives',
              'Because reverse-mode computes gradients of a scalar loss with respect to all D parameters in a single backward pass (O(1) passes)',
              'Because forward-mode requires CUDA GPU hardware while reverse-mode runs on standard CPUs',
              'Because reverse-mode does not require storing activations in memory',
            ],
            correctAnswer: 1,
            explanation: 'When output dimension is 1 (scalar loss) and input dimension is large (millions of parameters), reverse-mode requires only one backward pass to compute all partial derivatives, whereas forward mode requires D passes.',
            bloomLevel: 'L4 • Synthesis',
          },
          {
            id: 'q2',
            question: 'During backpropagation through a linear layer z = W · x + b where z ∈ ℝ^M, x ∈ ℝ^N, and incoming gradient is ∂L/∂z ∈ ℝ^M, what is ∂L/∂W?',
            options: [
              '(∂L/∂z)^T · x',
              'x · (∂L/∂z)^T',
              '(∂L/∂z) · x^T',
              'W^T · (∂L/∂z)',
            ],
            correctAnswer: 2,
            explanation: 'The outer product (∂L/∂z) · x^T has dimension (M × 1) × (1 × N) = M × N, matching the dimension of weight matrix W.',
            bloomLevel: 'L3 • Application',
          },
          {
            id: 'q3',
            question: 'Which numerical stability modification is applied to compute Cross-Entropy Loss safely in production ML frameworks?',
            options: [
              'Subtracting the vector maximum value before exponentiation in Softmax (Log-Sum-Exp trick)',
              'Clipping all gradients to strictly positive numbers',
              'Quantizing all floats to int8 before computing logs',
              'Using absolute difference instead of natural logarithms',
            ],
            correctAnswer: 0,
            explanation: 'Subtracting max(z) ensures the largest exponent evaluated is exp(0) = 1, preventing overflow without changing the mathematical probability distribution.',
            bloomLevel: 'L4 • Synthesis',
          },
        ],
      };

      return res.json({ success: true, data: fallbackResult, source: 'curriculum-engine' });
    } catch (err: any) {
      console.error('Error in /api/ai/personalize-notes:', err);
      return res.status(500).json({ error: err.message || 'Internal AI service error' });
    }
  });

  // AI Endpoint: Generate practice assessment from topic or weaknesses
  app.post('/api/ai/generate-assessment', async (req, res) => {
    try {
      const { topic, difficulty, questionCount = 3 } = req.body;
      const client = getAiClient();

      if (client) {
        const prompt = `Generate ${questionCount} university-level engineering practice questions for "${topic || 'Neural Networks & Deep Learning'}" at difficulty level "${difficulty || 'Adaptive Bloom L3-L4'}".
Return ONLY valid JSON matching this schema:
{
  "topic": "${topic}",
  "questions": [
    {
      "id": "q1",
      "question": "Clear, rigorous problem statement",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Clear educational breakdown",
      "bloomLevel": "L3" or "L4"
    }
  ]
}`;

        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ success: true, data: parsed, source: 'gemini-3.8-flash' });
      }

      // Fallback
      return res.json({
        success: true,
        data: {
          topic: topic || 'Neural Computation',
          questions: [
            {
              id: 'q1',
              question: `In ${topic || 'Computational Optimization'}, what is the primary role of momentum β in Adam and SGD with Momentum?`,
              options: [
                'Accelerates gradient descent along ravines and dampens high-frequency oscillations',
                'Guarantees finding the global minimum in non-convex loss surfaces',
                'Eliminates the need for a learning rate schedule',
                'Replaces the requirement for computing second-order Hessian matrices',
              ],
              correctAnswer: 0,
              explanation: 'Momentum accumulates exponentially decaying moving averages of past gradients, speeding up progress along consistent descent directions while canceling orthogonal oscillations.',
              bloomLevel: 'L3 • Application',
            },
          ],
        },
        source: 'curriculum-engine',
      });
    } catch (err: any) {
      console.error('Error in /api/ai/generate-assessment:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate assessment' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
