import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumListStyle,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  List,
  ListItem,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, EnumButtonStyle } from "../../Components/Button";
import "./ModelOrganizerConfirmation.scss";
import { EntityNode, ModelChanges, NODE_TYPE_MODEL, Node } from "./types";
import CreateApplyChangesLoader from "./CreateApplyChangesLoader";
import { ApplyChangesNextSteps } from "./ApplyChangesNextSteps";

type movedEntitiesData = {
  id: string;
  name: string;
};
export const CLASS_NAME = "model-organizer-confirmation";
const MIN_TIME_OUT_LOADER = 2000;

type Props = {
  onConfirmChanges: () => void;
  onCancelChanges: () => void;
  changes: ModelChanges;
  nodes: Node[];
  loadingCreateResourceAndEntities: boolean;
  createEntitiesError: boolean;
};

export default function ModelOrganizerConfirmation({
  onConfirmChanges,
  onCancelChanges,
  nodes,
  changes,
  loadingCreateResourceAndEntities,
  createEntitiesError,
}: Props) {
  const [applyChangesSteps, setApplyChangesSteps] = useState<boolean>(false);
  const [keepLoadingChanges, setKeepLoadingChanges] = useState<boolean>(false);

  const movedEntities = useMemo(() => {
    const movedEntities: movedEntitiesData[] = [];
    nodes
      .filter((n) => n.type === NODE_TYPE_MODEL)
      .forEach((n: EntityNode) => {
        if (n.data.originalParentNode !== n.parentNode) {
          movedEntities.push({
            id: n.data.payload.id,
            name: n.data.payload.displayName,
          });
        }
      });
    return movedEntities;
  }, [nodes]);

  useEffect(() => {
    if (loadingCreateResourceAndEntities) {
      setKeepLoadingChanges(true);
    }
  }, [setKeepLoadingChanges, loadingCreateResourceAndEntities]);

  const handleTimeout = useCallback(() => {
    setKeepLoadingChanges(false);
    setApplyChangesSteps(true);
  }, [setKeepLoadingChanges, setApplyChangesSteps]);

  return (
    <div className={CLASS_NAME}>
      {keepLoadingChanges || loadingCreateResourceAndEntities ? (
        <CreateApplyChangesLoader
          onTimeout={handleTimeout}
          minimumLoadTimeMS={MIN_TIME_OUT_LOADER}
        />
      ) : createEntitiesError ? (
        <FlexItem
          direction={EnumFlexDirection.Column}
          itemsAlign={EnumItemsAlign.Center}
        >
          <span>
            We encountered a problem while processing your new architecture.
          </span>
          <span> Please try again in a few minutes</span>
        </FlexItem>
      ) : applyChangesSteps ? (
        <ApplyChangesNextSteps onDisplayArchitectureClicked={onCancelChanges} />
      ) : !applyChangesSteps ? (
        <>
          {changes?.newServices?.length > 0 && (
            <div>
              <Panel panelStyle={EnumPanelStyle.Transparent}>
                <Text
                  textStyle={EnumTextStyle.Tag}
                  textColor={EnumTextColor.White}
                >
                  We're ready to create the following services using default
                  configurations for a smooth start.
                </Text>
                <br />
                <Text textStyle={EnumTextStyle.Tag}>
                  Remember, you can easily tailor the settings for each service
                  to your preference at any point.
                </Text>
              </Panel>

              <>
                <List listStyle={EnumListStyle.Dark}>
                  <ListItem>
                    {changes.newServices.map((service) => (
                      <Text textStyle={EnumTextStyle.Tag}>{service.name}</Text>
                    ))}
                  </ListItem>
                </List>
              </>
            </div>
          )}
          <div>
            <Panel panelStyle={EnumPanelStyle.Transparent}>
              <Text
                textStyle={EnumTextStyle.H2}
                textColor={EnumTextColor.White}
              >
                Confirm Architecture Changes
              </Text>
              <Text
                textStyle={EnumTextStyle.Tag}
                textColor={EnumTextColor.White}
              >
                The following entities will be moved to new services.
              </Text>
              <br />
              <a
                href={
                  "https://docs.amplication.com/how-to/understanding-break-the-monolith"
                }
                target="blank"
              >
                <Text textStyle={EnumTextStyle.Tag} underline>
                  Check our documentation
                </Text>
              </a>

              <Text textStyle={EnumTextStyle.Tag}>
                {" "}
                to understand how relations between entities are resolved as
                part of this migration process. <br /> In case of existing
                database, data migration may be required.
              </Text>
            </Panel>
            <List listStyle={EnumListStyle.Dark}>
              <ListItem>
                {movedEntities.length === 0 && (
                  <Text textStyle={EnumTextStyle.Tag}>
                    No entities will be moved
                  </Text>
                )}
                {movedEntities.map((entity) => (
                  <Text textStyle={EnumTextStyle.Tag}>{entity.name}</Text>
                ))}
              </ListItem>
            </List>
          </div>
          <FlexItem
            itemsAlign={EnumItemsAlign.Center}
            contentAlign={EnumContentAlign.End}
          >
            <Button
              buttonStyle={EnumButtonStyle.Outline}
              onClick={onCancelChanges}
            >
              Cancel
            </Button>
            <Button onClick={onConfirmChanges}>Let's go</Button>
          </FlexItem>
        </>
      ) : null}
    </div>
  );
}
