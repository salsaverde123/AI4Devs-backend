import { Request, Response } from 'express';
import { getPositionCandidatesList } from '../../application/services/positionService';

export const getPositionCandidates = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        if (isNaN(positionId)) {
            return res.status(400).json({ error: 'Formato de ID inválido' });
        }
        
        const candidates = await getPositionCandidatesList(positionId);
        res.json(candidates);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error al obtener candidatos', error: error.message });
        } else {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}; 