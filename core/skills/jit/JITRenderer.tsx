import React from 'react';
import { HybridCard } from '../ui/HybridCard';
import { MotionWrapper } from '../motion/MotionWrapper';

/**
 * Skill 3: Compilador JIT de Componentes
 * Speciality: Interfaces Generativas
 * 
 * Renders UI from JSON contracts (Axiom 2: Types are Living Documentation).
 */

type ComponentType = 'card' | 'button' | 'text' | 'container';

interface ComponentSchema {
    type: ComponentType;
    props?: Record<string, any>;
    children?: (ComponentSchema | string)[];
}

interface JITRendererProps {
    schema: ComponentSchema;
}

const ComponentMap: Record<ComponentType, React.FC<any>> = {
    card: HybridCard,
    button: (props: any) => (
        <MotionWrapper preset="snappy">
            <button {...props} className="bg-sky-500 text-white px-4 py-2 rounded-xl font-medium" />
        </MotionWrapper>
    ),
    text: (props: any) => <p {...props} />,
    container: (props: any) => <div {...props} className="space-y-4" />,
};

export const JITRenderer: React.FC<JITRendererProps> = ({ schema }) => {
    const Component = ComponentMap[schema.type];

    if (!Component) {
        console.error(`Unknown component type: ${schema.type}`);
        return null;
    }

    return (
        <Component {...schema.props}>
            {schema.children?.map((child, index) => {
                if (typeof child === 'string') return child;
                return <JITRenderer key={index} schema={child} />;
            })}
        </Component>
    );
};
