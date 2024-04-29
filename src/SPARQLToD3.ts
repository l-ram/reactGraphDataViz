import {
  BindingObject,
  ILinks,
  INodes,
  SPARQLQuerySelectResultsJSON,
} from "./types/types";

export const SPARQLToD3 = (sparqlQuery: SPARQLQuerySelectResultsJSON) => {
  const nodes: INodes[] = [];
  const links: ILinks[] = [];
  const nodesMap = new Map<string, number>();

  const recursiveBindingObject: any = (binding: BindingObject) => {
    let subject, predicate, object;

    if (binding.subject.type === "triple" || binding.object.type === "triple") {
      if (binding.subject.type === "triple") {
        const nestedSubject = recursiveBindingObject(binding.subject.value);
        subject = nestedSubject.subject;
        predicate = nestedSubject.predicate;
        object = nestedSubject.object;
      } else if (binding.object.type === "triple") {
        const nestedObject = recursiveBindingObject(binding.object.value);
        subject = nestedObject.subject;
        predicate = nestedObject.predicate;
        object = nestedObject.object;
      }
    } else {
      subject = binding.subject.value;
      predicate = binding.predicate.value;
      object = binding.object.value;
    }
    return { subject, predicate, object };
  };

  sparqlQuery.results.bindings.forEach((binding) => {
    const { subject, predicate, object } = recursiveBindingObject(binding);

    if (!nodesMap.has(subject)) {
      const node = { name: subject };
      nodesMap.set(subject, nodes.length);
      nodes.push(node);
    }
    if (!nodesMap.has(object)) {
      const node = { name: object };
      nodesMap.set(object, nodes.length);
      nodes.push(node);
    }

    const link = {
      source: nodes[nodesMap.get(subject) as any],
      target: nodes[nodesMap.get(object) as any],
    };
    links.push(link);

    return { nodes, links };
  });

  return;
};
