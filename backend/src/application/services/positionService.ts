import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CandidateResponse {
    id: number;
    fullName: string;
    current_interview_step: number;
    average_score: number;
}

export const getPositionCandidatesList = async (positionId: number): Promise<CandidateResponse[]> => {
    try {
        // Verificar si la posición existe
        const position = await prisma.position.findUnique({
            where: { id: positionId },
        });
        
        if (!position) {
            throw new Error('La posición no existe');
        }
        
        // Obtener aplicaciones para esta posición con los datos necesarios
        const applications = await prisma.application.findMany({
            where: {
                positionId: positionId
            },
            include: {
                candidate: true,
                interviews: true
            }
        });
        
        // Transformar los datos para el formato de respuesta
        const candidatesList = applications.map((app: any) => {
            // Calcular puntuación media de las entrevistas
            const averageScore = app.interviews.length > 0 
                ? app.interviews.reduce((sum: number, interview: any) => sum + (interview.score || 0), 0) / app.interviews.length 
                : 0;
            
            return {
                id: app.candidate.id,
                fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
                current_interview_step: app.currentInterviewStep,
                average_score: parseFloat(averageScore.toFixed(2))
            };
        });
        
        return candidatesList;
    } catch (error) {
        throw error;
    }
}; 