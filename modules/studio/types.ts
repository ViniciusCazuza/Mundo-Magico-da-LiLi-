/**
 * Tipos do Módulo Studio - Alinhados com DTOs do Backend .NET
 * 
 * Segue o padrão APEX Nível 15 - Make Illegal States Unrepresentable
 */

// ============================================================================
// Enums e Tipos Base
// ============================================================================

export enum DrawingLayerType {
  Raster = 'raster',
  Vector = 'vector',
  Skeletal = 'skeletal',
}

export enum BlendMode {
  Normal = 'normal',
  Multiply = 'multiply',
  Screen = 'screen',
  Overlay = 'overlay',
  Darken = 'darken',
  Lighten = 'lighten',
}

// ============================================================================
// Tipos de Geometria
// ============================================================================

export interface VectorPoint {
  x: number;
  y: number;
}

export interface BezierControlPoint {
  anchor: VectorPoint;
  controlPoint1: VectorPoint;
  controlPoint2: VectorPoint;
}

export interface BoneSegment {
  startPoint: VectorPoint;
  endPoint: VectorPoint;
  length: number;
}

// ============================================================================
// Tipos de Camada Base
// ============================================================================

export interface LayerBase {
  id: string;
  name: string;
  zIndex: number;
  opacity: number;
  isVisible: boolean;
  blendMode: string;
}

export interface RasterLayer extends LayerBase {
  type: DrawingLayerType.Raster;
  dataUrl: string;
}

export interface VectorLayer extends LayerBase {
  type: DrawingLayerType.Vector;
  path: BezierControlPoint[];
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  isClosed: boolean;
}

export interface Bone {
  id: string;
  parentId?: string;
  name: string;
  segment: BoneSegment;
  rotation: number;
  constraints: string[];
}

export interface SkeletalLayer extends LayerBase {
  type: DrawingLayerType.Skeletal;
  bones: Bone[];
  ikChains: string[];
}

export type Layer = RasterLayer | VectorLayer | SkeletalLayer;

// ============================================================================
// Tipos de Desenho
// ============================================================================

export interface CanvasSize {
  width: number;
  height: number;
}

export interface Drawing {
  id: string;
  authorId: string;
  title: string;
  canvasSize: CanvasSize;
  layers: Layer[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Tipos de Paginação
// ============================================================================

export interface PagedList<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// Tipos de Requisição
// ============================================================================

export interface CreateDrawingRequest {
  authorId: string;
  title: string;
  canvasSize: CanvasSize;
}

export interface UpdateDrawingRequest {
  id: string;
  title: string;
}

export interface AddLayerRequest {
  layerType: DrawingLayerType;
  name: string;
  content: string; // JSON stringified layer data
}

export interface UpdateLayerRequest {
  layerId: string;
  name: string;
  content: string;
}

// ============================================================================
// Result Pattern (Frontend)
// ============================================================================

export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
}

export type ApiError = 
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR';

// ============================================================================
// Configurações do Studio
// ============================================================================

export interface StudioOptions {
  artStyle: string;
  fantasyLevel: number;
  detailLevel: string;
  illustrationType: 'scene' | 'character';
  framing?: 'full' | 'portrait';
  orientation: 'horizontal' | 'vertical' | 'square';
  textConfig: {
    enabled: boolean;
    content: string;
  };
}

export interface StudioImageResponse {
  imageUrl: string;
  revisedPrompt: string;
  generationHash: string;
}