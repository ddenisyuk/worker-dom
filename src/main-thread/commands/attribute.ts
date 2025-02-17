import { AttributeMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';

export const AttributeProcessor: CommandExecutorInterface = (strings, nodes, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.ATTRIBUTES);

  /**
   * @param mutations
   * @param startPosition
   */
  const getValue = (mutations: any[]): string | null => {
    const value = mutations[AttributeMutationIndex.Value];
    // Value is sent as 0 when it's the default value or removal.
    // Value is sent as index + 1 when it's a valid value.
    return value !== 0 ? strings.get(value - 1) : null;
  };

  return {
    execute(mutations: any[], allowedMutation: boolean) {
      if (allowedExecution && allowedMutation) {
        const target = mutations[AttributeMutationIndex.Target];
        const attributeName = mutations[AttributeMutationIndex.Name];
        const value = getValue(mutations);

        if (target) {
          if (attributeName != null) {
            if (config.sanitizer) {
              const mutated = config.sanitizer.setAttribute(target, attributeName, value);
              if (!mutated) {
                // TODO(choumx): Inform worker that sanitizer ignored unsafe attribute value change.
              }
            } else {
              if (value == null) {
                target.removeAttribute(attributeName);
              } else {
                target.setAttribute(attributeName, value);
              }
            }
          }
        } else {
          console.error(`ATTR_LIST: target is null.`);
        }
      }
    },
    print(mutations: any[]): {} {
      const target = mutations[AttributeMutationIndex.Target];
      const attributeName = mutations[AttributeMutationIndex.Name];
      const value = getValue(mutations);

      return {
        target,
        allowedExecution,
        attributeName,
        value,
        remove: value == null,
      };
    },
  };
};
