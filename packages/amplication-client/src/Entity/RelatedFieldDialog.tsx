import React from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Dialog,
  DialogProps,
  EnumButtonStyle,
} from "@amplication/design-system";
import { camelCase } from "camel-case";
import { Formik } from "formik";
import { DisplayNameField } from "../Components/DisplayNameField";
import { Form } from "../Components/Form";
import NameField from "../Components/NameField";
import * as models from "../models";
import "./RelatedFieldDialog.scss";

export type Values = {
  relatedFieldName: string;
  relatedFieldDisplayName: string;
};

export type Props = Omit<DialogProps, "title"> & {
  onSubmit: (data: Values) => void;
  relatedEntityId: string | undefined;
  allowMultipleSelection: boolean;
  entity: models.Entity;
};

const EMPTY_VALUES: Values = {
  relatedFieldName: "",
  relatedFieldDisplayName: "",
};

const CLASS_NAME = "RelatedFieldDialog";

export const RelatedFieldDialog = ({
  isOpen,
  onDismiss,
  onSubmit,
  entity,
  relatedEntityId,
  allowMultipleSelection,
}: Props): React.ReactElement => {
  const { data, loading } = useQuery<{ entity: models.Entity }>(
    GET_RELATED_ENTITY_FIELDS,
    {
      variables: {
        entityId: relatedEntityId,
      },
      skip: !relatedEntityId,
    }
  );
  const valuesSuggestion = allowMultipleSelection
    ? {
        relatedFieldName: camelCase(entity.pluralDisplayName),
        relatedFieldDisplayName: entity.pluralDisplayName,
      }
    : {
        relatedFieldName: camelCase(entity.name),
        relatedFieldDisplayName: entity.displayName,
      };
  const initialValues: Values =
    data &&
    data.entity.fields?.every(
      (field) =>
        field.name !== valuesSuggestion.relatedFieldName &&
        field.displayName !== valuesSuggestion.relatedFieldDisplayName
    )
      ? valuesSuggestion
      : EMPTY_VALUES;
  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      title="Create relation field in related entity"
      className={CLASS_NAME}
    >
      <Formik
        onSubmit={onSubmit}
        initialValues={initialValues}
        enableReinitialize
      >
        {(formik) => (
          <Form>
            {loading && "Loading..."}
            <DisplayNameField
              name="relatedFieldDisplayName"
              label="Display Name"
              required
              disabled={loading}
            />
            <NameField name="relatedFieldName" required disabled={loading} />
            <div className={`${CLASS_NAME}__buttons`}>
              <Button
                type="button"
                buttonStyle={EnumButtonStyle.Clear}
                onClick={onDismiss}
              >
                Dismiss
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

const GET_RELATED_ENTITY_FIELDS = gql`
  query getRelatedEntity($entityId: String!) {
    entity(where: { id: $entityId }) {
      name
      displayName
      fields {
        id
        name
      }
    }
  }
`;
